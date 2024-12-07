import { ApiProperty } from '@nestjs/swagger';

class recommendedMenu {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;
}

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

export class getRamenyaByIdResDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  genre: string[];

  @ApiProperty()
  region: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  contactNumber?: string;

  @ApiProperty()
  instagramProfile?: string;

  @ApiProperty({ type: [businessHours] })
  businessHours: businessHours[];

  @ApiProperty({ type: [recommendedMenu] })
  recommendedMenu?: recommendedMenu[];

  @ApiProperty()
  isSelfmadeNoodle: boolean;
}
