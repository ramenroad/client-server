import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
})
export class notice extends Document {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['공지사항', '패치노트', '약관'],
  })
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'admin', required: true })
  writerId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  body: string;

  @Prop({
    required: false,
  })
  url: string;

  createdAt: Date;
}

export const noticeSchema = SchemaFactory.createForClass(notice);
