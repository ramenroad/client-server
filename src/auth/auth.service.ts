import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { HttpStatusCode } from 'axios';
import { Model } from 'mongoose';
import { user } from 'schema/user.schema';
import { signUpUserByKakaoReqDTO } from './dto/req/signUpUserByKakao.req.dto';
import { signInUserByKakakoReqDTO } from './dto/req/signInUserByKakao.req.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<user>,
    private readonly jwtService: JwtService,
  ) {}

  async signInUserByKakao(dto: signInUserByKakakoReqDTO, @Res() res: Response) {
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
        })
        .then((userInfo) => (newUser = userInfo));

      const tokens = await this.getUserTokens(
        newUser.id,
        newUser.email,
        newUser.nickname,
      );
      await this.updateUserRtHash(newUser.id, tokens.refreshToken);

      return res.status(201).json(tokens);
    } else {
      //존재하는 경우, 로그인 토큰 발급
      const tokens = await this.getUserTokens(
        user.id,
        user.email,
        user.nickname,
      );
      await this.updateUserRtHash(user.id, tokens.refreshToken);

      return res.status(200).json(tokens);
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
    const hashedRefreshToken = await this.hashData(rt);

    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  hashData(data: string): string {
    const salt = bcrypt.genSaltSync(10);

    const hashedData = bcrypt.hash(data, salt);
    return hashedData;
  }
}
