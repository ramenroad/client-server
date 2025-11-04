import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class Comment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'board', required: true }) // ★ 1. 어느 게시글(Board) 소속인지
  boardId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, default: 0 })
  likeCount: number;

  @Prop({ required: true, default: [] })
  likeUserIds: string[];

  // --- 여기부터 대댓글을 위한 필드 ---
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  })
  parentCommentId: MongooseSchema.Types.ObjectId | null;

  @Prop({ 
    required: true, 
    default: 0 
  })
  depth: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date | null;
  
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const commentSchema = SchemaFactory.createForClass(Comment);

commentSchema.index({ boardId: 1, parentCommentId: 1, createdAt: 1 });