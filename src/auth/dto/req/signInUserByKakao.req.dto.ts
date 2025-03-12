import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class signInUserByKakakoReqDTO {
  @ApiProperty({
    description: '카카오 인가 코드',
  })
  @IsString()
  @IsNotEmpty()
  authorizationCode: string;
}
