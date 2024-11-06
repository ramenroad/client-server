import { Test, TestingModule } from '@nestjs/testing';
import { RamenyaController } from '../ramenya.controller';
import { RamenyaService } from '../ramenya.service';

describe('RamenyaController', () => {
  let controller: RamenyaController;
  let service: RamenyaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RamenyaController],
      providers: [
        {
          provide: RamenyaService,
          useValue: {
            getRamenyas: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RamenyaController>(RamenyaController);
    service = module.get<RamenyaService>(RamenyaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
