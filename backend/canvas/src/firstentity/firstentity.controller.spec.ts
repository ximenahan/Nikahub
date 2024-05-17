import { Test, TestingModule } from '@nestjs/testing';
import { FirstentityController } from './firstentity.controller';
import { FirstentityService } from './firstentity.service';

describe('FirstentityController', () => {
  let controller: FirstentityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirstentityController],
      providers: [FirstentityService],
    }).compile();

    controller = module.get<FirstentityController>(FirstentityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
