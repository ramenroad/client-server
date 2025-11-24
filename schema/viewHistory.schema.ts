import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: { createdAt: 'createdAt'},
    versionKey: false,
})
export class ViewHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ramenya', required: true })
  ramenya: Types.ObjectId;

  @Prop({ default: Date.now })
  lastViewedAt: Date;
  
  // 30일(2592000초)이 지난 기록은 MongoDB가 알아서 삭제함
  @Prop({ expireAfterSeconds: 2592000 }) 
  createdAt: Date; 
}

const ViewHistorySchema = SchemaFactory.createForClass(ViewHistory);

// 1. 유저별 매장 중복 방지 (Upsert용)
ViewHistorySchema.index({ user: 1, ramenya: 1 }, { unique: true });

// 2. 마이페이지 조회 성능 최적화 (유저별 최근 본 순서 정렬)
ViewHistorySchema.index({ user: 1, lastViewedAt: -1 });

export const viewHistorySchema = SchemaFactory.createForClass(ViewHistory);