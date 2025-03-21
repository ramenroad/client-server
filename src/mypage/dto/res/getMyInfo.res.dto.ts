import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class getMyInfoResDTO {
  @ApiProperty({
    description: '유저의 Id',
    type: String,
  })
  _id: unknown;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  profileImageUrl: string;
}
