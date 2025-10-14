import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class signInUserByGoogleReqDTO {
  @ApiProperty({
    description: '구글 인가 코드',
  })
  @IsNotEmpty()
  accessToken: string;
}
