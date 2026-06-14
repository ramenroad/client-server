import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
})
export class inquiry extends Document {
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user', required: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  body: string;

  createdAt: Date;
}

export const inquirySchema = SchemaFactory.createForClass(inquiry);
