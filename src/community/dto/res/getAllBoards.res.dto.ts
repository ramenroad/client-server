import { ApiProperty } from '@nestjs/swagger';


class UserInfo {
  @ApiProperty({
    description: '작성자 고유 ID',
    example: '67d14c7923beabe6d9a470fa',
  })
  _id: string;

  @ApiProperty({
    description: '작성자 닉네임',
    example: '닉네임 변경 테스트1',
  })
  nickname: string;

  @ApiProperty({
    description: '작성자 프로필 이미지 URL',
    example:
      'https://ramenroad-dev.s3.amazonaws.com/images/profiles/5.jpg.webp',
  })
  profileImageUrl: string;
}

class BoardDetail {
  @ApiProperty({
    description: '게시글 고유 ID',
    example: '68fef8c5e43d5af47d3b24b9',
  })
  _id: string;

  @ApiProperty({
    description: '작성자 상세 정보 (UserInfo 객체)',
    type: UserInfo,
  })
  userId: UserInfo;

  @ApiProperty({
    description: '게시글 카테고리',
    example: 'test',
  })
  category: string;

  @ApiProperty({
    description: '게시글 제목',
    example: 'test1',
  })
  title: string;

  @ApiProperty({
    description: '게시글 본문',
    example: 'test1',
  })
  body: string;

  @ApiProperty({
    description: '댓글 수',
    example: 0,
  })
  commentCount: number;

  @ApiProperty({
    description: '좋아요 수',
    example: 0,
  })
  likeCount: number;

  @ApiProperty({
    description: '조회수',
    example: 0,
  })
  viewCount: number;

  @ApiProperty({
    description: '게시글 이미지 URL 목록',
    type: [String],
    example: [
      'https://ramenroad-dev.s3.amazonaws.com/images/board/canva.jpg.webp',
      'https://ramenroad-dev.s3.amazonaws.com/images/board/9dc141.png.webp',
    ],
  })
  ImageUrls: string[];

  @ApiProperty()
  createdAt?: string;

  @ApiProperty()
  updatedAt?: string;
}

export class getAllBoardsResDTO {
  @ApiProperty({
    description: '마지막 페이지 번호',
    example: 1,
  })
  lastPage: number;

  @ApiProperty({
    type: BoardDetail,
    isArray: true,
    description: '게시글 목록',
  })
  boards: unknown[] | BoardDetail[];
}