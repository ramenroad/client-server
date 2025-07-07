import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class searchKeyword extends Document {
  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  keyword: string;
}

export const searchKeywordSchema = SchemaFactory.createForClass(searchKeyword);
