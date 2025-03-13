import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class createReviewReqDTO {
  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  ramenyaId: string;

  @ApiProperty({
    required: true,
    type: 'number',
  })
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  review: string;

  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    example: ['image1.jpg', 'image2.jpg'],
    description: '리뷰 이미지',
  })
  reviewImageUrl?: Express.Multer.File[];
}
