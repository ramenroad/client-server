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
import { JwtPayload, RtJwtPayload } from 'src/common/types/jwtpayloadtype';
import { signInUserByNaverReqDTO } from './dto/req/signInUserByNaver.req.dto';
import { signInUserByNaverResDTO } from './dto/res/signInUserByNaver.res.dto';
import { signInUserByKakao406ResDTO } from './dto/res/signInUserByKakao.406.res.dto';
import { signInUserByNaver406ResDTO } from './dto/res/signInUserByNaver.406.res.dto';
import { signInUser403ResDTO } from './dto/res/signInUserByNaver.403.res.dto';
import { signInUserByGoogleResDTO } from './dto/res/signInUserByGoogle.res.dto';
import { signInUserByGoogleReqDTO } from './dto/req/signInUserByGoogle.req.dto';
import { signInUserByAppleReqDTO } from './dto/req/signInUserByApple.req.dto';
import { signInUserResDTO } from './dto/res/signInUser.res.dto';

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
    description:
      '로그인 성공  // 비회원이였던 경우, 회원가입 후 로그인 성공 // type 값은 signin,signup 중 하나입니다. 로그인 시 signin, 회원가입 시 signup ',
    type: signInUserByKakakoResDTO,
  })
  @ApiResponse({
    status: 403,
    description: '탈퇴한 회원인 경우',
    type: signInUser403ResDTO,
  })
  @ApiResponse({
    status: 406,
    description: '이미 가입된 이메일인 경우(네이버 소셜 로그인으로 가입된 경우)',
    type: signInUserByKakao406ResDTO,
  })
  @ApiResponse({
    status: 500,
    description: '사용자 정보 불러오기에 실패한 경우',
  })
  @Post('/signin/kakao')
  signInUserByKakao(
    @Body() dto: signInUserByKakakoReqDTO,
  ): Promise<signInUserByKakakoResDTO> {
    return this.authService.signInUserByKakao(dto);
  }

  @Public()
  @ApiOperation({
    summary: '네이버 소셜 로그인',
    description:
      '회원가입이 되어있지 않은 유저 정보는 자동 회원가입 후 토큰이 발급됩니다.',
  })
  @ApiResponse({
    status: 201,
    description:
      '로그인 성공  // 비회원이였던 경우, 회원가입 후 로그인 성공 // type 값은 signin,signup 중 하나입니다. 로그인 시 signin, 회원가입 시 signup ',
    type: signInUserByNaverResDTO,
  })
  @ApiResponse({
    status: 403,
    description: '탈퇴한 회원인 경우',
    type: signInUser403ResDTO,
  })
  @ApiResponse({
    status: 406,
    description: '이미 가입된 이메일인 경우.(카카오 소셜 로그인으로 가입된 경우)',
    type: signInUserByNaver406ResDTO,
  })
  @ApiResponse({
    status: 500,
    description: '사용자 정보 불러오기에 실패한 경우',
  })
  @Post('/signin/naver')
  signInUserByNaver(
    @Body() dto: signInUserByNaverReqDTO,
  ): Promise<signInUserByNaverResDTO> {
    return this.authService.signInUserByNaver(dto);
  }

  @Public()
  @ApiOperation({
    summary: '구글 소셜 로그인',
    description:
      '회원가입이 되어있지 않은 유저 정보는 자동 회원가입 후 토큰이 발급됩니다.',
  })
  @ApiResponse({
    status: 201,
    description:
      '로그인 성공  // 비회원이였던 경우, 회원가입 후 로그인 성공 // type 값은 signin,signup 중 하나입니다. 로그인 시 signin, 회원가입 시 signup ',
    type: signInUserByNaverResDTO,
  })
  @ApiResponse({
    status: 403,
    description: '탈퇴한 회원인 경우',
    type: signInUser403ResDTO,
  })
  @ApiResponse({
    status: 406,
    description: '이미 가입된 이메일인 경우.(카카오 소셜 로그인으로 가입된 경우)',
    type: signInUserByNaver406ResDTO,
  })
  @ApiResponse({
    status: 500,
    description: '사용자 정보 불러오기에 실패한 경우',
  })
  @Post('/signin/google')
  signInUserByGoogle(
    @Body() dto: signInUserByGoogleReqDTO,
  ): Promise<signInUserByGoogleResDTO> {
    return this.authService.signInUserByGoogle(dto);
  }

  @Public()
  @ApiOperation({
    summary: '애플 소셜 로그인',
    description:
      '회원가입이 되어있지 않은 유저 정보는 자동 회원가입 후 토큰이 발급됩니다.',
  })
  @ApiResponse({
    status: 201,
    description:
      '로그인 성공  // 비회원이였던 경우, 회원가입 후 로그인 성공 // type 값은 signin,signup 중 하나입니다. 로그인 시 signin, 회원가입 시 signup ',
    type: signInUserResDTO,
  })
  @ApiResponse({
    status: 403,
    description: '탈퇴한 회원인 경우',
    type: signInUser403ResDTO,
  })
  @ApiResponse({
    status: 406,
    description: '이미 가입된 이메일인 경우',
    type: signInUserByNaver406ResDTO,
  })
  @ApiResponse({
    status: 500,
    description: '사용자 정보 불러오기에 실패한 경우',
  })
  @Post('/signin/apple')
  signInUserByApple(
    @Body() dto: signInUserByAppleReqDTO,
  ): Promise<signInUserResDTO> {
    return this.authService.signInUserByApple(dto);
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
    @User() user: RtJwtPayload,
  ): Promise<refreshAccessTokenResDTO> {
    return this.authService.refreshAccessToken(user);
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @ApiResponse({
    status: 201,
    description: '로그아웃 성공',
  })
  @ApiBearerAuth('accessToken')
  @Post('signout')
  signOut(@User() user: JwtPayload): Promise<void> {
    return this.authService.signOut(user);
  }

  @ApiOperation({
    summary: '회원 탈퇴하기'
  })
  @ApiResponse({
    status: 201,
    description: '회원 탈퇴 성공',
  })
  @ApiBearerAuth('accessToken')
  @Post('withdrawal')
  withdrawal(@User() user: JwtPayload): Promise<void> {
    return this.authService.withdrawal(user);
  }
}
