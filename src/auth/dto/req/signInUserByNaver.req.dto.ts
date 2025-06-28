import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class signInUserByNaverReqDTO {
  @ApiProperty({
    description: '네이버 인가 코드',
  })
  @IsNotEmpty()
  authorizationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  state: string;
}