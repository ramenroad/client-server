import { ApiProperty } from '@nestjs/swagger';

class businessHours {
  @ApiProperty()
  day: string;

  @ApiProperty()
  operatingTime?: string;

  @ApiProperty()
  breakTime?: string;

  @ApiProperty()
  isOpen: boolean;
}
[];

class ramenroadReview {
  @ApiProperty()
  oneLineReview: string;

  @ApiProperty()
  description: string;
}

class ramenyas {
  @ApiProperty({
    type: String,
  })
  _id: unknown;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  genre: string[];

  @ApiProperty({
    type: String,
  })
  region: string;

  @ApiProperty({
    type: String,
  })
  address: string;

  @ApiProperty({
    type: Number,
  })
  latitude: number;

  @ApiProperty({
    type: Number,
  })
  longitude: number;

  @ApiProperty({ type: businessHours, isArray: true })
  businessHours: businessHours[];

  @ApiProperty({
    type: String,
  })
  thumbnailUrl: string;

  @ApiProperty({ type: ramenroadReview })
  ramenroadReview: ramenroadReview;
}

export class getRamenyaGroupsResDTO {
  @ApiProperty({
    type: String,
  })
  _id: unknown;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: Number,
  })
  type: number;

  @ApiProperty({
    type: Number,
  })
  priority: number;

  @ApiProperty({
    type: Boolean,
  })
  isShown: boolean;

  @ApiProperty({ type: ramenyas, isArray: true })
  ramenyas: ramenyas[];

  @ApiProperty({
    type: String,
  })
  descriptionImageUrl: string;
}
