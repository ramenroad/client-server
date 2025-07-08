import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

class BusinessHoursDto {
  @ApiProperty({ description: '요일', example: 'mon' })
  day: string;

  @ApiProperty({
    description: '영업시간',
    example: '11:30 ~ 20:30',
    required: false,
  })
  operatingTime?: string;

  @ApiProperty({
    description: '휴식시간',
    example: '15:00 ~ 17:00',
    required: false,
  })
  breakTime?: string;

  @ApiProperty({ description: '영업 여부', example: true })
  isOpen: boolean;
}

export class SearchResDto {
  @ApiProperty({
    description: '라멘집 고유 ID',
    example: '677acb4dedc563316f84e36b',
  })
  _id: string | unknown;

  @ApiProperty({ description: '라멘집 이름', example: '하쿠텐' })
  name: string;

  @ApiProperty({
    description: '라멘 장르',
    example: ['이에케'],
    type: [String],
  })
  genre: string[];

  @ApiProperty({ description: '주소', example: '서울 마포구 동교로 266-12' })
  address: string;

  @ApiProperty({ description: '위도', example: 37.562816482 })
  latitude: number;

  @ApiProperty({ description: '경도', example: 126.925813537 })
  longitude: number;

  @ApiProperty({ description: '영업시간 정보', type: [BusinessHoursDto] })
  businessHours: BusinessHoursDto[];

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example:
      'https://ramenroad-prod.s3.amazonaws.com/images/ramenyas/1736100730631하쿠텐thumbnail',
  })
  thumbnailUrl: string;

  @ApiProperty({
    description: '메뉴 목록',
    example: ['이에케 라멘'],
    type: [String],
  })
  menus: string[];

  @ApiProperty({ description: '평점', example: 0 })
  rating: number;

  @ApiProperty({ description: '리뷰 수', example: 0 })
  reviewCount: number;
}
