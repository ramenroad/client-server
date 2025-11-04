import { ApiProperty } from "@nestjs/swagger";

export class UserInfo {
    @ApiProperty({
        description: '사용자 고유 ID',
        example: '67d14c7923beabe6d9a470fa',
    })
    _id: string;

    @ApiProperty({
        description: '사용자 닉네임',
        example: '닉네임 변경 테스트1',
    })
    nickname: string;

    @ApiProperty({
        description: '프로필 이미지 URL',
        example: 'https://ramenroad-dev.s3.amazonaws.com/images/profiles/5.jpg.webp',
    })
    profileImageUrl: string;
}

export class getBoardDetailResDTO {

    @ApiProperty({
        description: '게시글 고유 ID',
        example: '68fef8c5e43d5af47d3b24b9',
    })
    _id: unknown | string;

    @ApiProperty({
        description: '작성자 정보',
        type: UserInfo,
    })
    userId: unknown | UserInfo;

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
        description: '게시글 내용',
        example: 'test1',
    })
    body: string;

    @ApiProperty({
        description: '좋아요 수',
        example: 0,
    })
    likeCount: number;

    @ApiProperty({
        description: '좋아요를 누른 사용자 ID 목록',
        example: ['67d14c7923beabe6d9a470fa', '67d14c7923beabe6d9a470fb'],
        type: [String],
    })
    likeUserIds: string[];  

    @ApiProperty({
        description: '조회수',
        example: 0,
    })
    viewCount: number;

    @ApiProperty({
        description: '댓글 수',
        example: 0,
    })
    commentCount: number;

    @ApiProperty({
        description: '게시글 이미지 URL 목록',
        example: [
            'https://ramenroad-dev.s3.amazonaws.com/images/board/canva-ginger-cat-with-paws-raised-in-air-MAGoQJ8-1Kc.jpg.webp',
            'https://ramenroad-dev.s3.amazonaws.com/images/board/9dc14126ee3e2d16b00d0a503b592cbb6fb33a4b4cf43b6605fc7a1e262f0845.png.webp'
        ],
        type: [String],
    })
    ImageUrls: string[];

    @ApiProperty({
        description: '생성일시',
        example: '2025-10-27T04:44:53.180Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: '수정일시',
        example: '2025-10-27T04:44:53.180Z',
    })
    updatedAt: Date;
}