import { ApiProperty } from "@nestjs/swagger";

export class getUserInfoResDTO {
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
  })
  avgReviewRating: number;

  @ApiProperty({
    description: '유저 리뷰 개수',
    example: 10,
  })
  reviewCount: number;

  @ApiProperty({
    description: '유저 프로필 공개 여부',
    example: true,
  })
  isPublic: boolean;

  @ApiProperty({
    description: '이번달 작성한 리뷰 갯수',
    example: 10,
  })
  currentMonthReviewCount: number;
}