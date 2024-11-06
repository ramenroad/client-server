import { Test, TestingModule } from '@nestjs/testing';
import { RamenyaService } from '../ramenya.service';
import { Model } from 'mongoose';
import { ramenya, ramenyaSchema } from '../../../schema/ramenya.schema';
import { InjectModel, MongooseModule, getModelToken } from '@nestjs/mongoose';
import { expectTypeOf } from 'expect-type';
import { getRamenyasResDTO } from '../dto/res/getRamenyas.res.dto';

describe('RamenyaService', () => {
  let service: RamenyaService;
  let ramenyaModel: Model<ramenya>;
  const ramenyasData = [
    {
      _id: '672839749870835f19507225',
      name: '부타노맥스',
      genre: '돈코츠',
      region: '강남구',
      address: '서울 강남구 학동로 338 강남파라곤 상가(S동) 로비층(L층) 110호',
      instagramProfile: 'https://www.instagram.com/butanomax',
      businessHours: [
        {
          day: 'mon',
          operatingTime: '11:00 ~ 20:30',
          breakTime: '14:30 ~ 17:00',
          isOpen: true,
        },
        {
          day: 'tue',
          operatingTime: '11:00 ~ 20:30',
          breakTime: '14:30 ~ 17:00',
          isOpen: true,
        },
        {
          day: 'wed',
          operatingTime: '11:00 ~ 20:30',
          breakTime: '14:30 ~ 17:00',
          isOpen: true,
        },
        {
          day: 'thu',
          operatingTime: '11:00 ~ 20:30',
          breakTime: '14:30 ~ 17:00',
          isOpen: true,
        },
        {
          day: 'fri',
          operatingTime: '11:00 ~ 20:30',
          breakTime: '14:30 ~ 17:00',
          isOpen: true,
        },
        {
          day: 'sat',
          operatingTime: '11:00 ~ 14:30',
          isOpen: true,
        },
        {
          day: 'sun',
          isOpen: false,
        },
      ],
      recommendedMenu: [
        {
          name: '돈코츠 시오',
        },
        {
          name: '돈코츠 쇼유',
        },
        {
          name: '매운 돈코츠',
        },
      ],
      isSelfmadeNoodle: true,
      createdAt: '2024-11-04T03:03:16.450Z',
      updatedAt: '2024-11-04T03:03:16.450Z',
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RamenyaService,
        {
          provide: getModelToken('ramenya'),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RamenyaService>(RamenyaService);
    ramenyaModel = module.get<Model<ramenya>>(getModelToken('ramenya'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRamenyas', () => {
    it('should have getRamenyas method', () => {
      expect(typeof service.getRamenyas).toBe('function');
    });

    it('should call ramenyaModel.find()', async () => {
      await service.getRamenyas();
      expect(ramenyaModel.find).toHaveBeenCalledTimes(1);
    });

    it('should return getRamenyasResDTO[]', async () => {
      ramenyaModel.find = jest.fn().mockReturnValue(ramenyasData);
      const result = await service.getRamenyas();
      expectTypeOf(result).toMatchTypeOf<getRamenyasResDTO[]>;
    });

    //StatusCode 체크는 e2e 테스트에서 진행
    /* 
    it('should return 200 status code', () => {});
    it('should return 404 status code', () => {}); 
    */
  });
});
