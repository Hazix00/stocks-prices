import { Test, TestingModule } from '@nestjs/testing';
import { StocksPricesController } from './stocks-prices.controller';

describe('StocksPricesController', () => {
  let controller: StocksPricesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksPricesController],
    }).compile();

    controller = module.get<StocksPricesController>(StocksPricesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
