import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({
    type: String,
  })
  _id: unknown | string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  reviewImageUrls: string[];
}

export class BusinessHour {
  @ApiProperty({
    description: '요일',
  })
  day: string;

  @ApiProperty({
    description: '영업시간',
    example: '11:30 ~ 20:00',
    required: false,
  })
  operatingTime?: string;

  @ApiProperty({
    description: '휴식시간',
    example: '15:00 ~ 17:00',
    required: false,
  })
  breakTime?: string;

  @ApiProperty({
    description: '영업 여부',
    example: true,
  })
  isOpen: boolean;
}

export class Ramenya {
  @ApiProperty({
    type: String,
  })
  _id: unknown | string;

  @ApiProperty({
    description: '라멘집 이름',
    example: '라멘롱시즌',
  })
  name: string;

  @ApiProperty({
    description: '라멘 장르',
    example: ['시오'],
    isArray: true,
  })
  genre: string[];

  @ApiProperty({
    description: '지역',
    example: '연남동',
  })
  region: string;

  @ApiProperty({
    description: '주소',
    example: '서울 마포구 동교로34길 21 지1층',
  })
  address: string;

  @ApiProperty({
    description: '위도',
    example: 37.560854874,
  })
  latitude: number;

  @ApiProperty({
    description: '경도',
    example: 126.925567832,
  })
  longitude: number;

  @ApiProperty({
    type: BusinessHour,
    isArray: true,
  })
  businessHours: BusinessHour[];

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://ramenroad-prod.s3.amazonaws.com/images/ramenyas/1736997285983라멘롱시즌thumbnail',
  })
  thumbnailUrl: string;

  @ApiProperty({
    description: '평점',
    example: 0,
  })
  rating: number;

  @ApiProperty({
    description: '리뷰 수',
    example: 0,
  })
  reviewCount: number;

  @ApiProperty({
    type: Review,
    isArray: true,
  })
  reviews: unknown | Review[];
}

export class getNearByRamenyaResDTO {
  @ApiProperty({
    type: Ramenya,
    isArray: true,
  })
  ramenyas: Ramenya[];
}