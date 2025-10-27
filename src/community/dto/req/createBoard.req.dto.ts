import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Express } from 'express';

export class createBoardReqDTO {

  @ApiProperty({
    required: true,
    type: 'string'
  })
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  title: string

  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    example: ['image1.jpg', 'image2.jpg'],
    description: '게시글 이미지 (최대 10장)',
    maxItems: 10,
  })
  Images?: Express.Multer.File[];
}
