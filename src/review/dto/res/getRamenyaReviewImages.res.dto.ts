import { ApiProperty } from '@nestjs/swagger';

export class getRamenyaReviewImagesResDTO {
  @ApiProperty()
  ramenyaReviewImagesUrls: string[];
}
