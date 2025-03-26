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
    required: false,
    unique: true,
  })
  nickname: string;

  @Prop({
    required: true,
    default:
      'https://ramenroad-prod.s3.ap-northeast-2.amazonaws.com/images/public/basic_profile.png',
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
