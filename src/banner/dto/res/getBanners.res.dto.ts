import { ApiProperty } from '@nestjs/swagger';

export class getBannersResDTO {
  @ApiProperty({
    type: 'string',
  })
  _id: unknown;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  priority: number;

  @ApiProperty()
  redirectUrl: string;

  @ApiProperty()
  isShown: boolean;

  @ApiProperty()
  bannerImageUrl: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
