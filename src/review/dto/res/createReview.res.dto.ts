import { ApiProperty } from '@nestjs/swagger';

export class createReviewResDTO {
  @ApiProperty({
    type: 'string',
  })
  _id: unknown;

  @ApiProperty()
  ramenyaId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  review: string;

  @ApiProperty()
  reviewImageUrls: string[];

  @ApiProperty({
    example: '2025-03-13T05:14:54.351Z',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-03-13T05:14:54.351Z',
  })
  updatedAt: string;
}
