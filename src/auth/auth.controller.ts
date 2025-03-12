import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { signUpUserByKakaoReqDTO } from './dto/req/signUpUserByKakao.req.dto';
import { signInUserByKakakoReqDTO } from './dto/req/signInUserByKakao.req.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: '카카오 소셜 로그인',
  })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 301,
    description:
      '해당 토큰 정보로 가입된 회원 정보가 없는 경우 // 회원가입 필요',
  })
  @ApiResponse({
    status: 500,
    description: '사용자 정보 불러오기에 실패한 경우',
  })
  @Post('/signin/kakao')
  signInUserByKakao(@Body() dto: signInUserByKakakoReqDTO) {
    return this.authService.signInUserByKakao(dto);
  }

  @Public()
  @ApiOperation({
    summary: '카카오 소셜 회원가입',
  })
  @ApiResponse({
    status: 201,
    description: '카카오 소셜 회원가입 성공',
  })
  @ApiResponse({
    status: 406,
    description: '해당 카카오 계정으로 이미 회원가입이 되어있는 경우',
  })
  @ApiResponse({
    status: 500,
    description: '카카오 서버에서 토큰을 불러오지 못한 경우',
  })
  @Post('/signup/kakao')
  signUpUserByKakao(@Body() dto: signUpUserByKakaoReqDTO): Promise<void> {
    return this.authService.signUpUserByKakao(dto);
  }
}
