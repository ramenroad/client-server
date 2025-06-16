import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class updateIsPublicReqDTO {
  @ApiProperty({
    required: true,
    type: Boolean,
  })
  @IsBoolean()
  isPublic: boolean;
}