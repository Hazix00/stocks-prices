import { StocksPricesRepository } from './stocks-prices.repository';

describe('StocksPricesRepository', () => {
  it('should be defined', () => {
    expect(new StocksPricesRepository()).toBeDefined();
  });
});
