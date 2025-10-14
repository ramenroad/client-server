import { ApiProperty } from '@nestjs/swagger';
import { ObjectId, Schema } from 'mongoose';

class user {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  profileImageUrl: string;
}

class MenuBoard {
  @ApiProperty({ type: String })
  _id: ObjectId;

  @ApiProperty({ type: user })
  userId: object;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  createdAt: Date;
}

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

class ramenroadReview {
  @ApiProperty()
  oneLineReview: string;

  @ApiProperty()
  description: string;
}

class review {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  ramenyaId: string;

  @ApiProperty({ type: user })
  userId: object;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  menus: string[];

  @ApiProperty()
  review: string;

  @ApiProperty({ type: [String] })
  reviewImageUrls: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class getRamenyaByIdResDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  thumbnailUrl: string;

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

  @ApiProperty({ type: ramenroadReview })
  ramenroadReview: ramenroadReview;

  @ApiProperty()
  isSelfmadeNoodle: boolean;

  @ApiProperty({
    type: 'number',
  })
  rating: number;

  @ApiProperty({
    type: 'number',
  })
  reviewCount: number;

  @ApiProperty({
    type: [String],
  })
  menus: string[];

  @ApiProperty({ type: [review], required: false })
  reviews?: ObjectId[];

  @ApiProperty()
  kakaoMapUrl?: string;

  @ApiProperty()
  kakaoMapDeepLink?: string;

  @ApiProperty()
  naverMapUrl?: string;

  @ApiProperty()
  naverMapDeepLink?: string;

  @ApiProperty()
  googleMapUrl?: string;

  @ApiProperty()
  googleMapDeepLink?: string;

  @ApiProperty({ type: MenuBoard, isArray: true })
  menuBoard?: MenuBoard[];
}
