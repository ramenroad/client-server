import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class Board extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, default: 0 })
  likeCount: number

  @Prop({ required: true, default: 0 })
  viewCount: number

  @Prop({ required: true, default: 0 })
  commentCount: number

  @Prop({
    default: [],
    type: [String],
  })
  ImageUrls: string[];

  @Prop({ default: false, required: true })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date | null;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const boardSchema = SchemaFactory.createForClass(Board);
