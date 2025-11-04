import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Express } from "express";

export class updateBoardReqDTO {


  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    type: 'string',
    description: '게시글 이미지 urls / 쉼표로 구분해서 string으로 보내주세요',
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim() === '' ? [] : value.split(',').filter((v) => v !== '');
    }
    return value;
  })
  ImageUrls?: string[];

  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    example: ['image1.jpg', 'image2.jpg'],
    description: '게시글 이미지',
  })
  Images?: Express.Multer.File[];
}