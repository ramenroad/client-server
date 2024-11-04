import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class ramenya extends Document {
  @Prop({
    required: true,
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
  contach_number: string;

  @Prop()
  instagram_profile: string;

  @Prop([
    {
      day: { type: String, required: true },
      operating_time: { type: String, required: true },
      break_time: { type: String, required: true },
    },
  ])
  business_hours: { day: string; operating_time: string; break_time: string }[];

  @Prop([{ name: String }])
  recommended_menu: { name: string }[];

  @Prop({
    required: true,
  })
  is_selfmade_noodle: boolean;
}
