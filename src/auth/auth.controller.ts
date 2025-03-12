import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { signUpUserByKakaoReqDTO } from './dto/req/signUpUserByKakao.req.dto';
import { signInUserByKakakoReqDTO } from './dto/req/signInUserByKakao.req.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';
import { signInUserByKakakoResDTO } from './dto/res/signInUserByKakao.res.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { refreshAccessTokenResDTO } from './dto/res/refreshAccessToken.res.dto';

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
    status: 201,
    description: '로그인 성공 // 비회원이였던 경우, 회원가입 후 로그인 성공',
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
  ): Promise<signInUserByKakakoResDTO> {
    return this.authService.signInUserByKakao(dto, res);
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({
    summary: 'Access Token 재발급',
    description: 'refreshToken을 Bearer 토큰으로 설정해주세요.',
  })
  @ApiBearerAuth('refreshToken')
  @ApiResponse({
    status: 201,
    description: '토큰 재발급 성공',
    type: refreshAccessTokenResDTO,
  })
  @ApiResponse({
    status: 403,
    description: 'refreshToken이 유효하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: 'accessToken이 유효하지 않은 경우',
  })
  @Post('refresh')
  refreshAccessToken(
    @User() user: AuthResponse,
  ): Promise<refreshAccessTokenResDTO> {
    return this.authService.refreshAccessToken(user);
  }
}
