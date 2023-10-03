import { Test, TestingModule } from '@nestjs/testing';
import { StocksPricesService } from './stocks-prices.service';

describe('StocksPricesService', () => {
  let service: StocksPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StocksPricesService],
    }).compile();

    service = module.get<StocksPricesService>(StocksPricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
