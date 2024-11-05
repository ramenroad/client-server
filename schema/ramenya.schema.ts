import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
    required: true,
  })
  genre: string;

  @Prop({
    required: true,
  })
  region: string;

  @Prop({
    required: true,
  })
  address: string;

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
    operatingTime: string;
    breakTime: string;
    isOpen: boolean;
  }[];

  @Prop([{ name: String, _id: false }])
  recommendedMenu: { name: string }[];

  @Prop({
    required: true,
  })
  isSelfmadeNoodle: boolean;
}

export const ramenyaSchema = SchemaFactory.createForClass(ramenya);
