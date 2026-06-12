import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

class MyCommentBoardInfo {
    @ApiProperty({ description: '게시글 고유 ID', example: '68fef8c5e43d5af47d3b24b9', type: String })
    _id: Schema.Types.ObjectId | unknown;

    @ApiProperty({ description: '게시판 카테고리', example: '전체' })
    category: string;

    @ApiProperty({ description: '게시글(본문) 제목', example: '강남 라멘 맛있는 곳 추천해주세요!' })
    title: string;
}

class MyCommentParentUser {
    @ApiProperty({ description: '작성자 고유 ID', example: '68fef8c5e43d5af47d3b24b9', type: String })
    _id: Schema.Types.ObjectId | unknown;

    @ApiProperty({ description: '작성자 닉네임', example: '해피' })
    nickname: string;

    @ApiProperty({ description: '작성자 프로필 이미지 URL', required: false, nullable: true })
    profileImageUrl: string | null;
}

class MyCommentParentInfo {
    @ApiProperty({ description: '부모 댓글 고유 ID', example: '68fef8c5e43d5af47d3b24b9', type: String })
    _id: Schema.Types.ObjectId | unknown;

    @ApiProperty({ description: '부모 댓글 본문', example: '네 지금 대기중입니다 ㅎㅎ' })
    body: string;

    @ApiProperty({ description: '부모 댓글 작성자', type: MyCommentParentUser })
    userId: MyCommentParentUser;
}

export class getMyCommentsResDTO {
    @ApiProperty({
        description: '댓글 고유 ID',
        example: '68fef8c5e43d5af47d3b24b9',
        type: String,
    })
    _id: Schema.Types.ObjectId | unknown;

    @ApiProperty({
        description: '소속 게시글(본문) 정보',
        type: MyCommentBoardInfo,
    })
    boardId: MyCommentBoardInfo;

    @ApiProperty({
        description: '댓글 본문',
        example: '감사합니다!',
    })
    body: string;

    @ApiProperty({
        description: '댓글 깊이 (0=댓글, 1 이상=답글)',
        example: 1,
        type: Number,
    })
    depth: number;

    @ApiProperty({
        description: '댓글 좋아요 수',
        example: 2,
        type: Number,
    })
    likeCount: number;

    @ApiProperty({
        description: '답글일 경우 부모(상위) 댓글, 일반 댓글이면 null',
        type: MyCommentParentInfo,
        nullable: true,
        required: false,
    })
    parentCommentId: MyCommentParentInfo | null;

    @ApiProperty({
        description: '생성일시',
        example: '2025-11-17T00:00:00.000Z',
        type: Date,
    })
    createdAt: Date;

    @ApiProperty({
        description: '수정일시',
        example: '2025-11-17T00:00:00.000Z',
        type: Date,
    })
    updatedAt: Date;
}
