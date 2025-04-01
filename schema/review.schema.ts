import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class review extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ramenya', required: true })
  ramenyaId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  review: string;

  @Prop({ required: false })
  menus: string[];

  @Prop({
    default: [],
    type: [String],
  })
  reviewImageUrls: string[];
}

export const reviewSchema = SchemaFactory.createForClass(review);
