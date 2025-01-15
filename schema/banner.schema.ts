import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class banner extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  priority: number;

  @Prop({
    required: true,
  })
  redirectUrl: string;

  @Prop({
    required: true,
  })
  isShown: boolean;

  @Prop({
    required: true,
  })
  bannerImageUrl: string;
}

export const bannerSchema = SchemaFactory.createForClass(banner);
