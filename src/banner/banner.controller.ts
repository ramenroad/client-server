import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banner.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { getBannersResDTO } from './dto/res/getBanners.res.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Public()
  @ApiOperation({
    summary: '배너 리스트 조회',
  })
  @ApiResponse({
    status: 200,
    description: '배너 리스트 조회 성공',
    type: getBannersResDTO,
    isArray: true,
  })
  @Get()
  getBanners(): Promise<getBannersResDTO[]> {
    return this.bannerService.getBanners();
  }
}
