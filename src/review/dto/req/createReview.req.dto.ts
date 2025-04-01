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
    type: 'string',
    example: '돈코츠라멘,매운돈코츠라멘',
    description: '메뉴 이름을 띄어쓰기 없이 쉼표로 구분',
  })
  menus: string;

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
