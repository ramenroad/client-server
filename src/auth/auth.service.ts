import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { HttpStatusCode } from 'axios';
import { Model } from 'mongoose';
import { user } from 'schema/user.schema';
import { signInUserByKakakoReqDTO } from './dto/req/signInUserByKakao.req.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { signInUserByKakakoResDTO } from './dto/res/signInUserByKakao.res.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<user>,
    private readonly jwtService: JwtService,
  ) {}

  async signInUserByKakao(
    dto: signInUserByKakakoReqDTO,
    @Res() res: Response,
  ): Promise<signInUserByKakakoResDTO> {
    // <-> Kakao API / 리프레쉬 토큰으로 카카오 토큰 재발급
    const header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY,
      code: dto.authorizationCode,
      redirect_uri: 'http://localhost:5173',
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

      return tokens;
    } else {
      //존재하는 경우, 로그인 토큰 발급
      const tokens = await this.getUserTokens(
        user.id,
        user.email,
        user.nickname,
      );
      await this.updateUserRtHash(user.id, tokens.refreshToken);

      return tokens;
    }
  }

  async getUserTokens(userId: string, email: string, nickname: string) {
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

  async refreshAccessToken(user: any) {
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
      user.payload.nickname,
    );
    await this.updateUserRtHash(user.payload.id, tokens.refreshToken);

    return tokens;
  }
}
