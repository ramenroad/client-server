import { ApiProperty } from '@nestjs/swagger';

class RamenyaInfo {
  @ApiProperty({
    description: '라멘야 ID',
    example: '677acb4dedc563316f84e36b',
    type: String,
  })
  _id: unknown;

  @ApiProperty({
    description: '라멘야 이름',
    example: '하쿠텐2',
  })
  name: string;
}

class Review {
  @ApiProperty({
    description: '리뷰 ID',
    example: '67d2684a09134d50cfcdd3d7',
    type: String,
  })
  _id: unknown;

  @ApiProperty({
    description: '라멘야 정보',
    type: RamenyaInfo,
  })
  ramenyaId: unknown | RamenyaInfo;

  @ApiProperty({
    description: '평점',
    example: 4,
  })
  rating: number;

  @ApiProperty({
    description: '리뷰 내용',
    example: '정말 맛있어요오오오오오오',
  })
  review: string;

  @ApiProperty({
    description: '리뷰 이미지 URL 목록',
    type: String,
    example: [
      'https://ramenroad-dev.s3.amazonaws.com/images/reviews/dasd.png.webp',
    ],
    isArray: true,
  })
  reviewImageUrls: string[];

  @ApiProperty({
    description: '생성일',
    example: '2025-03-13T05:08:26.781Z',
  })
  createdAt?: string;

  @ApiProperty({
    description: '수정일',
    example: '2025-06-04T10:29:46.720Z',
  })
  updatedAt?: string;

  @ApiProperty({
    description: '메뉴 목록',
    type: String,
    isArray: true,
  })
  menus: string[];
}

export class getMyReviewsResDTO {
  @ApiProperty({
    description: '리뷰 총 개수',
    example: 11,
  })
  reviewCount: number;

  @ApiProperty({
    description: '리뷰 목록',
    type: Review,
    isArray: true,
  })
  reviews: unknown | Review[];
}
