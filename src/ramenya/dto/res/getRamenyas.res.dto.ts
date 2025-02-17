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

export class getRamenyasResDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  thumbnailUrl: string;

  @ApiProperty()
  genre: string[];

  @ApiProperty()
  region: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: [businessHours] })
  businessHours: businessHours[];
}
