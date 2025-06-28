import { ApiProperty } from '@nestjs/swagger';

export class signInUserByNaverResDTO {
  @ApiProperty({
    description:
      'type 값은 signin,signup 중 하나입니다. 로그인 시 signin, 회원가입 시 signup ',
  })
  type: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
