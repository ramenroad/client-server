import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ramenya } from 'schema/ramenya.schema';
import { searchKeyword } from 'schema/searchKeyword.schema';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import SearchParams from './interfaces/searchParam.interface';
import { SearchResDto } from './dto/res/search.res.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel('ramenya') private readonly ramenyaModel: Model<ramenya>,
    @InjectModel('searchKeyword')
    private readonly searchKeywordModel: Model<searchKeyword>,
  ) {}

  async search(params: SearchParams): Promise<SearchResDto[]> {
    const { query, userId, latitude, longitude, radius } = params;
    //검색어와 일치하는 매장 이름이 있으면 먼저 리턴
    //TODO - atlas search 적용
    const resultsOfSearchByName = await this.ramenyaModel
      .find({
        name: query,
      })
      .select(
        '_id name thumbnailUrl address genre menus rating reviewCount latitude longitude businessHours',
      );

    if (resultsOfSearchByName.length > 0) {
      await this.saveSearchKeyword(
        userId,
        query,
        'ramenyaName',
        resultsOfSearchByName[0]._id.toString(),
      );
      return resultsOfSearchByName;
    }

    const searchPipeline = [];

    //검색어 점수 쿼리
    const keywordScoreQuery = [
      {
        text: {
          query,
          path: 'name',
          score: { boost: { value: 3 } },
        },
      },
      {
        text: {
          query,
          path: 'genre',
          score: { boost: { value: 2 } },
        },
      },
    ];

    // 위치 기반 필터를 조건적으로 추가
    let geoFilterQuery;

    if (latitude && longitude && radius) {
      geoFilterQuery = {
        geoWithin: {
          circle: {
            center: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            radius: radius,
          },
          path: 'location',
        },
      };
    }

    searchPipeline.push(
      {
        $search: {
          index: 'geo',
          compound: {
            should: keywordScoreQuery,
            minimumShouldMatch: 1,
            ...(geoFilterQuery ? { filter: geoFilterQuery } : {}),
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          thumbnailUrl: 1,
          address: 1,
          genre: 1,
          menus: 1,
          rating: 1,
          reviewCount: 1,
          latitude: 1,
          longitude: 1,
          businessHours: 1,
        },
      },
    );

    const searchResults = await this.ramenyaModel.aggregate(searchPipeline);

    // 일반 검색어로 저장
    await this.saveSearchKeyword(userId, query, 'searchKeyword');
    return searchResults;
  }

  private async saveSearchKeyword(
    userId: string | undefined,
    query: string,
    type: 'searchKeyword' | 'ramenyaName',
    ramenyaId?: string,
  ) {
    if (!userId) return;

    const existingKeyword = await this.searchKeywordModel.findOne({
      userId,
      type,
      keyword: query,
      isDeleted: false,
    });

    if (existingKeyword) {
      existingKeyword.count++;
      await existingKeyword.save();
    } else {
      await this.searchKeywordModel.create({
        type,
        keyword: query,
        userId,
        ...(ramenyaId && { ramenyaId }),
      });
    }
  }
}
