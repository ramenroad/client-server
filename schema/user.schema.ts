import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class user extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
  })
  nickname: string;

  @Prop({
    required: true,
    default: '',
  })
  profileImageUrl: string;

  @Prop({
    required: false,
  })
  kakaoId: string;

  @Prop({
    required: false,
  })
  refreshToken: string;
}

export const userSchema = SchemaFactory.createForClass(user);
