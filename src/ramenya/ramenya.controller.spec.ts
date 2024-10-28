import { Test, TestingModule } from '@nestjs/testing';
import { RamenyaController } from './ramenya.controller';

describe('RamenyaController', () => {
  let controller: RamenyaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RamenyaController],
    }).compile();

    controller = module.get<RamenyaController>(RamenyaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
