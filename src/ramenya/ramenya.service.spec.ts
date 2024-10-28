import { Test, TestingModule } from '@nestjs/testing';
import { RamenyaService } from './ramenya.service';

describe('RamenyaService', () => {
  let service: RamenyaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RamenyaService],
    }).compile();

    service = module.get<RamenyaService>(RamenyaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
