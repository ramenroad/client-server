import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Express } from 'express';

export class updateReviewReqDTO {
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
    type: 'string',
    description: '리뷰 이미지 urls / 쉼표로 구분해서 string으로 보내주세요',
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim() === '' ? [] : value.split(',').filter((v) => v !== '');
    }
    return value;
  })
  reviewImageUrls?: string[];

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
  reviewImages?: Express.Multer.File[];
}
