import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getRamenyasResDTO } from './dto/res/getRamenyas.res.dto';
import { getRamenyaByIdResDTO } from './dto/res/getRamenyaById.res.dto';
import { ramenya } from 'schema/ramenya.schema';
import { ramenyaGroup } from 'schema/ramenyaGroup.schema';
import { getRamenyaGroupsResDTO } from './dto/res/getRamenyaGroups.res.dto';
import { getNearByRamenyaResDTO } from './dto/res/getNearByRamenya.res.dto';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { uploadMenuBoardReqDTO } from './dto/req/uploadMenuBoard.req.dto';
import { CommonService } from 'src/common/common.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RamenyaService {
  constructor(
    @InjectModel('ramenya') private readonly ramenyaModel: Model<ramenya>,
    @InjectModel('ramenyaGroup')
    private readonly ramenyaGroupModel: Model<ramenyaGroup>,
    private readonly commonService: CommonService,
  ) {}

  async getRamenyas(
    region?: string,
    genre?: string,
  ): Promise<getRamenyasResDTO[]> {
    type queryType = {
      region?: string;
      genre?: {
        $in: string[];
      };
    };

    const query: queryType = {};

    if (region) {
      query.region = region;
    }
    if (genre) {
      const searchKeywordOfGenreArray = genre.split(',');

      query.genre = { $in: searchKeywordOfGenreArray };
    }

    const ramenyas = await this.ramenyaModel
      .find(query)
      .select(
        'name thumbnailUrl genre region address businessHours longitude latitude ramenroadReview rating reviewCount',
      );

    return ramenyas;
  }

  async getRamenyaById(id: string): Promise<getRamenyaByIdResDTO> {
    const ramenya = await this.ramenyaModel
      .findById(id)
      .select(
        'name thumbnailUrl genre region address latitude longitude contactNumber instagramProfile businessHours recommendedMenu ramenroadReview isSelfmadeNoodle rating reviewCount menus reviews kakaoMapUrl kakaoMapDeepLink naverMapUrl naverMapDeepLink googleMapUrl googleMapDeepLink menuBoard',
      )
      .populate({
        path: 'reviews',
        options: { limit: 3, sort: { createdAt: -1 } },
        populate: { path: 'userId', select: 'nickname profileImageUrl' },
      })
      .populate({
        path: 'menuBoard',
        populate: { path: 'userId', select: 'nickname profileImageUrl' },
      });

    if (!ramenya) {
      throw new HttpException('Ramenya not found', HttpStatus.NOT_FOUND);
    }

    return ramenya;
  }

  async getRamenyasRegion(): Promise<Array<string>> {
    const result = await this.ramenyaModel.find().select('region');

    const regions = [];

    let i;
    for (i = 0; i < result.length; i++) {
      regions.push(result[i].region);
    }

    const regionsSet = new Set(regions);
    const uniqueRegions = [...regionsSet];

    return uniqueRegions;
  }

  async getRamenyaGroups(): Promise<getRamenyaGroupsResDTO[]> {
    const ramenyaGroups = await this.ramenyaGroupModel
      .find({
        isShown: true,
      })
      .sort({ priority: 1 });

    return ramenyaGroups;
  }

  async getNearByRamenya(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<getNearByRamenyaResDTO> {
    const ramenyas = await this.ramenyaModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius,
          },
        },
      })
      .select(
        'name thumbnailUrl genre region address businessHours longitude latitude rating reviewCount',
      )
      .sort({ rating: -1 });

    return {
      ramenyas: ramenyas,
    };
  }

  async uploadMenuBoard(
    user: JwtPayload,
    dto: uploadMenuBoardReqDTO,
    menuBoardImages: Express.Multer.File[],
  ): Promise<void> {
    const ramenya = await this.ramenyaModel.findById(dto.ramenyaId);

    if (!ramenya) {
      throw new NotFoundException('존재하지 않는 라멘 매장입니다.');
    }

    for (const image of menuBoardImages) {
      const url = await this.commonService.uploadImageFileToS3(
        'images/menu-board/',
        uuidv4(),
        image,
      );

      if (url instanceof Error) {
        throw new InternalServerErrorException('S3 이미지 업로드 실패');
      }

      await this.ramenyaModel
        .findByIdAndUpdate(ramenya._id, {
          $push: {
            menuBoard: {
              imageUrl: url,
              description: dto.description,
              userId: user.id,
            },
          },
        })
        .catch((error) => {
          throw new InternalServerErrorException('메뉴판 업로드 실패');
        });
    }

    return;
  }
}
