import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: { createdAt: true, updatedAt: true },
  versionKey: false,
})
export class searchKeyword extends Document {
  @Prop({
    required: true,
    enum: ['searchKeyword', 'ramenyaName'],
  })
  type: 'searchKeyword' | 'ramenyaName';

  @Prop({
    required: true,
  })
  keyword: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ramenya',
    required: false,
  })
  ramenyaId?: MongooseSchema.Types.ObjectId;

  @Prop({
    default: 1,
  })
  count: number;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const searchKeywordSchema = SchemaFactory.createForClass(searchKeyword);
