import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class ramenCalendar extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user', required: true })
  userId: MongooseSchema.Types.ObjectId;

  // 방문한 날짜. 시각 없는 달력 날짜이므로 Date가 아닌 'YYYY-MM-DD' 문자열로 저장(타임존 변환 회피).
  @Prop({ required: true })
  visitDate: string;

  @Prop({ required: true })
  ramenyaName: string;

  // 검색에서 고른 경우에만 매장 참조. 직접 입력이면 null.
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ramenya', required: false, default: null })
  ramenyaId: MongooseSchema.Types.ObjectId | null;

  @Prop({ type: [String], default: [] })
  menus: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const ramenCalendarSchema = SchemaFactory.createForClass(ramenCalendar);

// 유저별 월 범위(visitDate) 조회 최적화
ramenCalendarSchema.index({ userId: 1, visitDate: 1 });
