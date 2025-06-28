import { ApiProperty } from '@nestjs/swagger';

export class signInUserByKakao406ResDTO {
  @ApiProperty({
    description: '에러 메시지',
    example: '이메일 zz0905k@naver.com은 이미 가입된 주소입니다.',
  })
  message: string;

  @ApiProperty({
    description: '중복된 이메일 주소',
    example: 'zz0905k@naver.com',
  })
  email: string;

  @ApiProperty({
    description: '에러 코드',
    example: 'EMAIL_ALREADY_EXISTS',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP 상태 코드',
    example: 406,
  })
  statusCode: number;
}