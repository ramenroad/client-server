import { ApiProperty } from '@nestjs/swagger';

export class refreshAccessTokenResDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
