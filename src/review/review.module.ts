import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ramenyaSchema } from 'schema/ramenya.schema';
import { reviewSchema } from 'schema/review.schema';
import { CommonService } from 'src/common/common.service';
import { userSchema } from 'schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ramenya', schema: ramenyaSchema },
      {
        name: 'review',
        schema: reviewSchema,
      },
      {
        name: 'user',
        schema: userSchema,
      },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, CommonService],
})
export class ReviewModule {}
