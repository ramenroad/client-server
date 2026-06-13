import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt' },
  versionKey: false,
})
export class Bookmark extends Document {
  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ramenya', required: true })
  ramenya: Types.ObjectId;

  createdAt: Date;
}

export const bookmarkSchema = SchemaFactory.createForClass(Bookmark);

// 1. 유저별 매장 중복 저장 방지
bookmarkSchema.index({ user: 1, ramenya: 1 }, { unique: true });

// 2. 마이페이지 저장 목록 조회 성능 최적화 (유저별 최신순 정렬)
bookmarkSchema.index({ user: 1, createdAt: -1 });
