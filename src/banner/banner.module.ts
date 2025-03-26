import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { bannerSchema } from 'schema/banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'banner', schema: bannerSchema }]),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
