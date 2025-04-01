import { ApiProperty } from '@nestjs/swagger';
import { Date, ObjectId, Schema as MongooseSchema } from 'mongoose';

class user {
  @ApiProperty({
    type: String,
  })
  _id: unknown;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  profileImageUrl: string;
}

export class review {
  @ApiProperty({
    type: String,
  })
  _id: unknown;

  @ApiProperty({
    type: String,
  })
  ramenyaId: unknown;

  @ApiProperty({ type: user })
  userId: unknown | user;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  menus?: string[];

  @ApiProperty()
  review: string;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  reviewImageUrls: string[];

  @ApiProperty({
    example: '2025-03-25T12:41:17.160Z',
  })
  createdAt?: string;

  @ApiProperty({
    example: '2025-03-25T12:41:17.160Z',
  })
  updatedAt?: string;
}

export class getRamenyaReviewsResDTO {
  @ApiProperty()
  lastPage: number;

  @ApiProperty({ type: review, isArray: true })
  reviews: review[];
}
