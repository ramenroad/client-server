import { ApiProperty } from '@nestjs/swagger';

export class signInUserByKakakoResDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
