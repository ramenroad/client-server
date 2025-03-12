import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { signUpUserByKakaoReqDTO } from './dto/req/signUpUserByKakao.req.dto';
import { signInUserByKakakoReqDTO } from './dto/req/signInUserByKakao.req.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';
import { signInUserByKakakoResDTO } from './dto/res/signInUserByKakao.res.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: '카카오 소셜 로그인',
    description:
      '회원가입이 되어있지 않은 유저 정보는 자동 회원가입 후 토큰이 발급됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '기존 회원 로그인 성공',
    type: signInUserByKakakoResDTO,
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 및 로그인 성공',
    type: signInUserByKakakoResDTO,
  })
  @ApiResponse({
    status: 500,
    description: '사용자 정보 불러오기에 실패한 경우',
  })
  @Post('/signin/kakao')
  signInUserByKakao(
    @Body() dto: signInUserByKakakoReqDTO,
    @Res() res: Response,
  ) {
    return this.authService.signInUserByKakao(dto, res);
  }
}
