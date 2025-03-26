import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { banner } from 'schema/banner.schema';
import { getBannersResDTO } from './dto/res/getBanners.res.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel('banner') private readonly bannerModel: Model<banner>,
  ) {}

  async getBanners(): Promise<getBannersResDTO[]> {
    const banners = await this.bannerModel.find().sort({ prioirty: 1 });

    return banners;
  }
}
