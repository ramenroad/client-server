import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ramenya } from 'schema/ramenya.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel('ramenya') private readonly ramenyaModel: Model<ramenya>,
  ) {}

  async search(query: string) {
    const ramenya = await this.ramenyaModel.aggregate([
      {
        $search: {
          index: 'ramenya',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: 'name',
                  score: { boost: { value: 3 } },
                },
              },
              {
                text: {
                  query: query,
                  path: 'menus',
                  score: { boost: { value: 1 } },
                },
              },
              {
                text: {
                  query: query,
                  path: 'genre',
                  score: { boost: { value: 2 } },
                },
              },
              {
                text: {
                  query: query,
                  path: 'address',
                  score: { boost: { value: 1 } },
                },
              },
            ],
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
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
          score: 1,
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return ramenya;
  }
}
