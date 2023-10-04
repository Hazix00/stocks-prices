import { Test } from '@nestjs/testing';
import { StocksPricesRepository } from './stocks-prices.repository';
import { describe } from 'node:test';
import { stocksPricesStub } from '../test/stubs/stocks-prices.stubs';
import { QueryStocksDto } from './dtos/query-stocks.dto';

describe('StocksPricesRepository', () => {
  let repository: StocksPricesRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StocksPricesRepository],
    }).compile();

    repository = module.get(StocksPricesRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('when calling find', () => {
    it('then should be defined', () => {
      expect(repository.find).toBeDefined();
    });
    it('then return an array of StockPrice objects when no query is provided', async () => {
      jest
        .spyOn(repository.stockPrice, 'findMany')
        .mockResolvedValue(stocksPricesStub());

      const result = await repository.find();

      expect(repository.stockPrice.findMany).toHaveBeenCalledTimes(1);
      expect(repository.stockPrice.findMany).toHaveBeenCalledWith({
        where: {},
      });

      expect(result).toEqual(stocksPricesStub());
    });
    it("then return an array of StockPrice objects filtered by company when 'company' query parameter is provided", async () => {
      const stubs = stocksPricesStub().filter(
        (stockPrice) => stockPrice.company === 'GOOGLE'
      );
      const query: QueryStocksDto = {
        company: 'GOOGLE',
      };

      jest.spyOn(repository.stockPrice, 'findMany').mockResolvedValue(stubs);

      const result = await repository.find(query);

      expect(repository.stockPrice.findMany).toHaveBeenCalledTimes(1);
      expect(repository.stockPrice.findMany).toHaveBeenCalledWith({
        where: {
          company: query.company,
        },
      });

      expect(result).toEqual(stubs);
    });

    it("should return an array of StockPrice objects filtered by year when 'year' query parameter is provided", async () => {
      const query: QueryStocksDto = {
        year: 2022,
      };
      const startDate = new Date(`${query.year}-01-01T00:00:00Z`).getTime();
      const endDate = new Date(`${query.year + 1}-01-01T00:00:00Z`).getTime();

      const stubs = stocksPricesStub().filter(
        (stockPrice) =>
          stockPrice.timestamp >= startDate && stockPrice.timestamp < endDate
      );

      jest.spyOn(repository.stockPrice, 'findMany').mockResolvedValue(stubs);

      const result = await repository.find(query);

      expect(repository.stockPrice.findMany).toHaveBeenCalledTimes(1);
      expect(repository.stockPrice.findMany).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      expect(result).toEqual(stubs);
    });
  });
});
