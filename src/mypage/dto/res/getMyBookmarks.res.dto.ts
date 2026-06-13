import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

class BusinessHour {
  @ApiProperty({ example: 'mon' })
  day: string;

  @ApiProperty({ required: false, example: '11:00 ~ 19:30' })
  operatingTime?: string;

  @ApiProperty({ required: false, example: '15:00 ~ 17:00' })
  breakTime?: string;

  @ApiProperty({ example: true })
  isOpen: boolean;
}

class RamenyaInfo {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '라멘집 이름',
    example: '하쿠텐2',
  })
  name: string;

  @ApiProperty({
    description: '라멘 장르',
    example: ['이에케'],
    isArray: true,
  })
  genre: string[];

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://ramenroad-prod.s3.amazonaws.com/images/ramenyas/1736100990758하쿠텐thumbnail',
    required: false,
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: '평점',
    example: 4.175150079210811,
  })
  rating: number;

  @ApiProperty({
    description: '리뷰 수',
    example: 37,
  })
  reviewCount: number;

  @ApiProperty({
    description: '주소',
    example: '서울 중구 필동로 22 1층',
  })
  address: string;

  @ApiProperty({
    description: '위도',
    example: 37.559639954,
  })
  latitude: number;

  @ApiProperty({
    description: '경도',
    example: 126.996047038,
  })
  longitude: number;

  @ApiProperty({
    type: [BusinessHour],
    description: '영업시간',
  })
  businessHours: BusinessHour[];
}

export class getMyBookmarksResDTO {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId | unknown;

  @ApiProperty({
    type: RamenyaInfo,
    description: '라멘집 정보',
  })
  ramenya: RamenyaInfo | Types.ObjectId;

  @ApiProperty({
    type: String,
    description: '유저 ID',
    example: '68b7e8b24a4de49abf27860c',
  })
  user: Types.ObjectId;

  @ApiProperty({
    description: '저장일시',
    example: '2025-11-22T16:39:17.074Z',
  })
  createdAt: Date;
}
