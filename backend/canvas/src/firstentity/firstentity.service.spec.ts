import { Test, TestingModule } from '@nestjs/testing';
import { FirstentityService } from './firstentity.service';

describe('FirstentityService', () => {
  let service: FirstentityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirstentityService],
    }).compile();

    service = module.get<FirstentityService>(FirstentityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
