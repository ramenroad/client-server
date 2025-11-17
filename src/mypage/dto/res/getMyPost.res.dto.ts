import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

export class getMyPostsResDTO {
    @ApiProperty({
        description: '게시글 고유 ID',
        example: '68fef8c5e43d5af47d3b24b9',
        type: String,
    })
    _id: Schema.Types.ObjectId | unknown;

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

    @ApiProperty({
        description: '생성일시',
        example: '2025-11-17T00:00:00.000Z',
    })
    createdAt?: Date;

    @ApiProperty({
        description: '수정일시',
        example: '2025-11-17T00:00:00.000Z',
    })
    updatedAt?: Date;
}