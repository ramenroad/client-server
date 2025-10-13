import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class deleteMenuBoardReqDTO {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  ramenyaId: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  menuBoardId: string;
}
