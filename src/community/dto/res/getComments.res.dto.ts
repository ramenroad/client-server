import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsArray, 
  IsBoolean, 
  IsDate, 
  IsInt, 
  IsMongoId, 
  IsNotEmpty, 
  IsNumber, 
  IsObject, 
  IsOptional, 
  IsString, 
  ValidateNested 
} from 'class-validator';
import { Types } from 'mongoose';

export class CommentUserResDTO {
  @ApiProperty({
    type: String,
    description: '유저의 ObjectId',
    example: '67d14c7923beabe6d9a470fa',
  })
  _id: Types.ObjectId | string;

  @ApiProperty({
    type: String,
    description: '유저 닉네임',
    example: '닉네임 변경 테스트1',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    type: String,
    description: '유저 프로필 이미지 URL',
    example: 'https://ramenroad-dev.s3.amazonaws.com/images/profiles/5.jpg.webp',
  })
  @IsString()
  profileImageUrl: string;
}

export class CommentNodeResDTO {
  @ApiProperty({
    type: String,
    description: '댓글의 ObjectId',
    example: '690075687ad0498225517c17',
  })
  _id: Types.ObjectId | string;

  @ApiProperty({
    type: () => CommentUserResDTO,
    description: '댓글 작성자 정보',
  })
  @IsObject()
  @Type(() => CommentUserResDTO)
  userId: CommentUserResDTO;

  @ApiProperty({
    type: String,
    description: '댓글 본문',
    example: '테스트댓글1',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    type: Number,
    description: '좋아요 개수',
    example: 0,
  })
  @IsInt()
  likeCount: number;

  @ApiProperty({
    type: [String],
    description: '좋아요를 누른 유저 ID 목록',
    example: [],
  })
  @IsArray()
  likeUserIds: string[];

  @ApiProperty({
    type: String,
    nullable: true,
    description: '부모 댓글의 ObjectId (1차 댓글인 경우 null)',
    example: null,
  })
  @IsMongoId()
  @IsOptional()
  parentCommentId: Types.ObjectId | string | null;

  @ApiProperty({
    type: Number,
    description: '댓글 깊이 (0부터 시작)',
    example: 0,
  })
  @IsInt()
  depth: number;

  @ApiProperty({
    type: Boolean,
    description: '삭제 여부',
    example: false,
  })
  @IsBoolean()
  isDeleted: boolean;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: '삭제 일시',
    example: null,
  })
  @IsDate()
  @IsOptional()
  deletedAt: Date | null;

  @ApiProperty({
    type: Date,
    description: '생성 일시',
    example: '2025-10-28T07:48:56.898Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: '수정 일시',
    example: '2025-10-28T07:48:56.898Z',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    type: () => [CommentNodeResDTO], // 재귀적으로 자기 자신을 배열로 참조
    description: '답글(대댓글) 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentNodeResDTO)
  replies: CommentNodeResDTO[];
}