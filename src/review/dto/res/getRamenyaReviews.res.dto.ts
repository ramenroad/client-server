import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    type: String,
  })
  _id: unknown;

  @ApiProperty({
    description: '유저 닉네임',
    example: 'test',
  })
  nickname: string;

  @ApiProperty({
    description: '유저 프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
  })
  profileImageUrl: string;

  @ApiProperty({
    description: '유저 평균 별점',
    example: 4.5,
    type: Number
  })
  avgReviewRating: number;

  @ApiProperty({
    description: '유저가 작성한 리뷰 개수',
    example: 10,
    type: Number
  })
  reviewCount: number;
}

export class Review {
  @ApiProperty({
    type: String,
  })
  _id: unknown;

  @ApiProperty({
    type: String,
  })
  ramenyaId: unknown;

  @ApiProperty({ 
    type: User,
    description: '리뷰 작성자 정보'
  })
  userId: User;

  @ApiProperty({
    description: '리뷰 별점',
    example: 4.5,
    type: Number
  })
  rating: number;

  @ApiProperty({
    description: '주문한 메뉴 목록',
    type: [String],
    example: ['라멘', '교자']
  })
  menus?: string[];

  @ApiProperty({
    description: '리뷰 내용',
    example: '맛있었습니다.'
  })
  review: string;

  @ApiProperty({ 
    description: '리뷰 이미지 URL 목록',
    type: [String],
    example: ['https://example.com/review1.jpg', 'https://example.com/review2.jpg']
  })
  reviewImageUrls: string[];

  @ApiProperty({
    description: '리뷰 작성 시간',
    example: '2025-03-25T12:41:17.160Z',
  })
  createdAt?: string;

  @ApiProperty({
    description: '리뷰 수정 시간',
    example: '2025-03-25T12:41:17.160Z',
  })
  updatedAt?: string;
}

export class getRamenyaReviewsResDTO {
  @ApiProperty({
    description: '마지막 페이지 번호',
    example: 5
  })
  lastPage: number;

  @ApiProperty({ 
    type: Review, 
    isArray: true,
    description: '리뷰 목록'
  })
  reviews: unknown | Review[];
}
