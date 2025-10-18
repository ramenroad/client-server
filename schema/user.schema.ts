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
  naverId: string;

  @Prop({
    required: false,
  })
  googleId: string;

  @Prop({
    required: false,
  })
  appleId: string;

  @Prop({
    required: true,
    default: true,
  })
  isPublic: boolean;

  @Prop({
    required: false,
  })
  refreshToken: string;

  @Prop({
    default: 0,
  })
  avgReviewRating: number;

  @Prop({
    default: 0,
  })
  reviewCount: number;

  @Prop({
    default: null,
  })
  deletedAt: Date;
}

export const userSchema = SchemaFactory.createForClass(user);
