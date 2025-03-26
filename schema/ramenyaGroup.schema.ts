import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class ramenya {
  _id: string;

  name: string;

  genre: string[];

  thumbnailUrl: string;

  address: string;

  region: string;

  @Prop({
    required: true,
  })
  latitude: number;

  @Prop({
    required: true,
  })
  longitude: number;

  businessHours: {
    day: string;
    operatingTime?: string;
    breakTime?: string;
    isOpen: boolean;
  }[];

  @Prop({
    required: true,
    type: {
      oneLineReview: { type: String, required: true },
      description: { type: String, required: true },
    },
    _id: false,
  })
  ramenroadReview: { oneLineReview: string; description: string };
}

@Schema({
  versionKey: false,
})
export class ramenyaGroup extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  description: string;

  @Prop({
    default: 1,
    required: true,
  })
  type: number;

  @Prop({
    required: true,
  })
  priority: number;

  @Prop({
    required: true,
  })
  isShown: boolean;

  @Prop()
  descriptionImageUrl: string;

  @Prop()
  ramenyas: ramenya[];
}

export const ramenyaGroupSchema = SchemaFactory.createForClass(ramenyaGroup);
