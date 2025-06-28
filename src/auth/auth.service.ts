import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { HttpStatusCode } from 'axios';
import { Model } from 'mongoose';
import { user } from 'schema/user.schema';
import { signInUserByKakakoReqDTO } from './dto/req/signInUserByKakao.req.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { signInUserByKakakoResDTO } from './dto/res/signInUserByKakao.res.dto';
import { JwtPayload, RtJwtPayload } from 'src/common/types/jwtpayloadtype';
import { signInUserByNaverReqDTO } from './dto/req/signInUserByNaver.req.dto';
import { signInUserByNaverResDTO } from './dto/res/signInUserByNaver.res.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<user>,
    private readonly jwtService: JwtService,
  ) {}

  async signInUserByKakao(
    dto: signInUserByKakakoReqDTO,
  ): Promise<signInUserByKakakoResDTO> {
    // <-> Kakao API / 리프레쉬 토큰으로 카카오 토큰 재발급
    const header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY,
      code: dto.authorizationCode,
      redirect_uri: process.env.KAKAO_REDIRECT_URL,
    };

    const apiUrl = 'https://kauth.kakao.com/oauth/token';

    let response1;

    try {
      response1 = await axios.post(apiUrl, body, { headers: header });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('카카오 토큰 발급 실패');
    }

    // <-> Kakao API / 토큰으로 사용자 정보 받아오기 API 요청
    const userToken = response1.data.access_token;

    const header2 = {
      Authorization: `Bearer ${userToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const response2: any = await axios.get(
      `https://kapi.kakao.com/v2/user/me?property_keys=["kakao_account.email"]`,
      {
        headers: header2,
      },
    );

    if (response2.status != 200)
      throw new InternalServerErrorException(
        '사용자 정보 불러오기에 실패했습니다.',
      );

    //사용자 정보가 DB에 존재하는지 확인(카카오 고유 id로 확인)
    const user = await this.userModel.findOne({
      kakaoId: String(response2.data.id),
    });

    if (!user) {
      //존재하지 않는 경우, 유저 생성 후 토큰 발급
      let newUser;
      await this.userModel
        .create({
          email: response2.data.kakao_account.email,
          kakaoId: String(response2.data.id),
          nickname: await this.generateRandomNickname(),
        })
        .then((userInfo) => (newUser = userInfo));

      const tokens = await this.getUserTokens(
        newUser.id,
        newUser.email,
        newUser.nickname,
      );

      await this.updateUserRtHash(newUser.id, tokens.refreshToken);

      const response = {
        type: 'signup',
        ...tokens,
      };

      return response;
    } else {
      //존재하는 경우, 로그인 토큰 발급
      const tokens = await this.getUserTokens(
        user.id,
        user.email,
        user.nickname,
      );
      await this.updateUserRtHash(user.id, tokens.refreshToken);

      const response = {
        type: 'signin',
        ...tokens,
      };

      return response;
    }
  }

  async getUserTokens(userId: string, email: string, nickname?: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          email: email,
          nickname: nickname,
        },
        {
          secret: process.env.JWT_AT_SECRET,
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          email: email,
        },
        {
          secret: process.env.JWT_RT_SECRET,
          expiresIn: 60 * 60 * 24 * 14,
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateUserRtHash(userId: string, rt: string): Promise<void> {
    const hashedRefreshToken = bcrypt.hashSync(rt, 10);
    //const hashedRefreshToken = await this.hashData(rt);

    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async generateRandomNickname() {
    const lastNames = [
      '매콤한',
      '깔끔한',
      '시원한',
      '녹진한',
      '진한',
      '맛있는',
      '짭잘한',
      '기름진',
    ];
    const firstNames = [
      '돈코츠',
      '시오',
      '쇼유',
      '이에케',
      '지로',
      '토리파이탄',
      '니보시',
      '아사리',
      '탄탄멘',
      '마제소바',
      '아부라소바',
      '츠케멘',
    ];

    const randomLastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomFirstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomNumber = Math.floor(100 + Math.random() * 900);

    const nickname =
      randomLastName + ' ' + randomFirstName + ' ' + randomNumber;

    //중복확인
    const alreadyExist = await this.userModel.findOne({
      nickname: nickname,
    });

    if (alreadyExist) {
      return this.generateRandomNickname();
    }

    return nickname;
  }

  async refreshAccessToken(user: RtJwtPayload) {
    const userRt = user.refreshToken;
    const userId = user.payload.id;

    const existedUser = await this.userModel.findById(userId);

    if (!existedUser || !existedUser.refreshToken) {
      throw new HttpException(
        'AccessToken이 유효하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const rtMatches = await bcrypt.compare(userRt, existedUser.refreshToken);

    if (!rtMatches) {
      throw new HttpException(
        '해당 유저의 refreshToken이 아닙니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    const tokens = await this.getUserTokens(
      user.payload.id,
      user.payload.email,
      existedUser.nickname,
    );
    await this.updateUserRtHash(user.payload.id, tokens.refreshToken);

    return tokens;
  }

  async signOut(user: JwtPayload): Promise<void> {
    //로그아웃

    await this.userModel.findByIdAndUpdate(user.id, {
      refreshToken: '',
    });

    return;
  }


  //작업 중
  async signInUserByNaver(
    dto: signInUserByNaverReqDTO,
  ): Promise<signInUserByNaverResDTO> {
    // <-> Naver API / 리프레쉬 토큰으로 네이버 토큰 재발급
    const naverClientId = process.env.NAVER_DEVELOPERS_CLIENT_ID;
    const naverClientSecret = process.env.NAVER_DEVELOPERS_CLIENT_SECRET;
    
    const header = {
      "X-Naver-Client-Id": naverClientId,
			"X-Naver-Client-Secret": naverClientSecret,
    };

    const apiUrl = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' + naverClientId + '&client_secret=' + naverClientSecret + '&code=' + dto.authorizationCode + '&state=' + dto.state;

    let response1;

    try {
      response1 = await axios.get(apiUrl, { headers: header });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('네이버 토큰 발급 실패');
    }

    if (response1.status != 200){
      throw new InternalServerErrorException(
        '네이버 토큰 발급 실패(인증실패)',
      );
    }
    
    // <-> Naver API / 토큰으로 사용자 정보 받아오기 API 요청
    const userToken = response1.data.access_token;

    const header2 = {
      Authorization: `Bearer ${userToken}`,
    };

    let response2;

    try {
      response2 = await axios.get(
        `https://openapi.naver.com/v1/nid/me`,
        {
          headers: header2,
        },
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('네이버 토큰 발급 실패');
    }

    if (response2.status != 200)
      throw new InternalServerErrorException(
        '네이버 사용자 정보 불러오기 실패',
      );
    
    //사용자 정보가 DB에 존재하는지 확인(네이버 고유 id로 확인)
    const user = await this.userModel.findOne({
      naverId: String(response2.data.response.id),
    });

    //동일한 이메일로 가입된 유저가 있는지 확인
    const existingUserByEmail = await this.userModel.findOne({
      email: response2.data.response.email,
      naverId: { $ne: String(response2.data.response.id) }, // 현재 네이버 ID가 아닌 다른 유저
    });
    
    if (existingUserByEmail) {
      throw new NotAcceptableException(`이메일 ${response2.data.response.email}은 이미 가입된 주소입니다.`);
    }

    if (!user) {
      //존재하지 않는 경우, 유저 생성 후 토큰 발급
      let newUser;
      await this.userModel
        .create({
          email: response2.data.response.email,
          naverId: String(response2.data.response.id),
          nickname: await this.generateRandomNickname(),
        })
        .then((userInfo) => (newUser = userInfo));

      const tokens = await this.getUserTokens(
        newUser.id,
        newUser.email,
        newUser.nickname,
      );

      await this.updateUserRtHash(newUser.id, tokens.refreshToken);

      const response = {
        type: 'signup',
        ...tokens,
      };

      return response;
    } else {
      //존재하는 경우, 로그인 토큰 발급
      const tokens = await this.getUserTokens(
        user.id,
        user.email,
        user.nickname,
      );
      await this.updateUserRtHash(user.id, tokens.refreshToken);

      const response = {
        type: 'signin',
        ...tokens,
      };

      return response;
    }
  }
}
