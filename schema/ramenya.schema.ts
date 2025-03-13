import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class ramenya extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: false,
  })
  thumbnailUrl: string;

  @Prop({
    required: true,
  })
  genre: string[];

  @Prop({
    required: true,
  })
  region: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
  })
  latitude: number;

  @Prop({
    required: true,
  })
  longitude: number;

  @Prop()
  contactNumber: string;

  @Prop()
  instagramProfile: string;

  @Prop([
    {
      day: { type: String, required: true },
      operatingTime: { type: String },
      breakTime: { type: String },
      isOpen: { type: Boolean, required: true },
      _id: false,
    },
  ])
  businessHours: {
    day: string;
    operatingTime?: string;
    breakTime?: string;
    isOpen: boolean;
  }[];

  @Prop([{ name: String, price: Number, _id: false }])
  recommendedMenu: { name: string; price: number }[];

  @Prop({
    required: true,
    type: {
      oneLineReview: { type: String, required: true },
      description: { type: String, required: true },
    },
    _id: false,
  })
  ramenroadReview: { oneLineReview: string; description: string };

  @Prop({
    required: true,
  })
  isSelfmadeNoodle: boolean;

  @Prop({
    required: true,
    default: [],
  })
  menus: string[];

  @Prop({
    type: Number,
    default: 0,
    required: true,
  })
  rating: number;

  @Prop({
    type: Number,
    default: 0,
    required: true,
  })
  reviewCount: number;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'review' }], // 배열로 수정
    required: false,
  })
  reviews: MongooseSchema.Types.ObjectId[];
}

export const ramenyaSchema = SchemaFactory.createForClass(ramenya);
