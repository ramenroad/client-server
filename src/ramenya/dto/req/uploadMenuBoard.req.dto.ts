import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class uploadMenuBoardReqDTO {
  @ApiProperty()
  @IsNotEmpty()
  ramenyaId: string;

  @ApiProperty({
    required: true,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    example: ['image1.jpg', 'image2.jpg'],
    description: '메뉴판 이미지',
  })
  menuBoardImages: Express.Multer.File[];

  @ApiProperty({
    required: false,
    type: 'string',
    description: '메뉴판 설명',
  })
  description: string;
}
