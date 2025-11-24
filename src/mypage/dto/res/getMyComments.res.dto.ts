import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

export class getMyCommentsResDTO {
    @ApiProperty({
        description: '댓글 고유 ID',
        example: '68fef8c5e43d5af47d3b24b9',
        type: String,
    })
    _id: Schema.Types.ObjectId | unknown;


    @ApiProperty({
        description: '게시글 고유 ID',
        example: '68fef8c5e43d5af47d3b24b9',
        type: String,
    })
    boardId: Schema.Types.ObjectId | unknown;

    @ApiProperty({
        description: '댓글 본문',
        example: 'test1',
    })
    body: string;

    @ApiProperty({
        description: '댓글 깊이',
        example: 0,
        type: Number,
    })
    depth: number;

    @ApiProperty({
        description: '댓글 좋아요 수',
        example: 0,
        type: Number,
    })
    likeCount: number;

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