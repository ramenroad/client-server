import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class ramenya {
  _id: string;

  name: string;

  genre: string[];

  thumbnailUrl: string;

  address: string;

  region: string;

  businessHours: {
    day: string;
    operatingTime?: string;
    breakTime?: string;
    isOpen: boolean;
  }[];
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
