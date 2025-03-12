import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class signUpUserByKakaoReqDTO {
  @ApiProperty({
    description: '카카오 인가 코드',
  })
  @IsString()
  @IsNotEmpty()
  authorizationCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
