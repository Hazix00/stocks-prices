import { Test } from '@nestjs/testing';
import { StocksPricesRepository } from './stocks-prices.repository';
import { describe } from 'node:test';
import { stocksPricesStub } from '../test/stubs/stocks-prices.stubs';
import { QueryStocksDto } from './dtos/query-stocks.dto';
import { stocksPricesPerMonthStub } from '../test/stubs/stocks-prices-per-month.stubs';
import { StocksPricesPerMonthDto } from '@shared';
import { BadRequestException } from '@nestjs/common';

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
      // Mock the return result of findMany method
      jest
        .spyOn(repository.stockPrice, 'findMany')
        .mockResolvedValue(stocksPricesStub());

      // Call the method
      const result = await repository.find();

      // Assert

      expect(repository.stockPrice.findMany).toHaveBeenCalledTimes(1);
      expect(repository.stockPrice.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: {
          timestamp: 'asc',
        }
      });

      expect(result).toEqual(stocksPricesStub());
    });
    it("then return an array of StockPrice objects filtered by company when 'company' query parameter is provided", async () => {
      // Mock the query result
      const stubs = stocksPricesStub().filter(
        (stockPrice) => stockPrice.company === 'GOOGLE'
      );
      const query: QueryStocksDto = {
        company: 'GOOGLE',
      };

      //Mock the return result of findMany method

      jest.spyOn(repository.stockPrice, 'findMany').mockResolvedValue(stubs);

      // Call the method
      const result = await repository.find(query);

      // Assert
      expect(repository.stockPrice.findMany).toHaveBeenCalledTimes(1);
      expect(repository.stockPrice.findMany).toHaveBeenCalledWith({
        where: {
          company: query.company,
        },
        orderBy: {
          timestamp: 'asc',
        }
      });

      expect(result).toEqual(stubs);
    });

    it("should return an array of StockPrice objects filtered by year when 'year' query parameter is provided", async () => {
      // Mock the query result
      const query: QueryStocksDto = {
        year: 2022,
      };
      const startDate = new Date(`${query.year}-01-01T00:00:00Z`).getTime();
      const endDate = new Date(`${query.year + 1}-01-01T00:00:00Z`).getTime();

      const stubs = stocksPricesStub().filter(
        (stockPrice) =>
          stockPrice.timestamp >= startDate && stockPrice.timestamp < endDate
      );

      //Mock the return result of findMany method

      jest.spyOn(repository.stockPrice, 'findMany').mockResolvedValue(stubs);

      // Call the method
      const result = await repository.find(query);

      // Assert
      expect(repository.stockPrice.findMany).toHaveBeenCalledTimes(1);
      expect(repository.stockPrice.findMany).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: {
          timestamp: 'asc',
        }
      });

      expect(result).toEqual(stubs);
    });
  });

  describe('when calling findStocksPricesGroupedByMonthAndAvgPrice', () => {
    it('then should be defined', () => {
      expect(repository.findStocksPricesGroupedByMonthAndAvgPrice).toBeDefined();
    });

    it('the retrieve average prices of stocks grouped by month and company when year and company filters are provided', async () => {
      // Mock the query result
      const mockResult = stocksPricesPerMonthStub().filter(item => item.company === 'GOOGLE');

      jest.spyOn(repository, '$queryRaw').mockResolvedValue(mockResult);

      // Call the method with filters
      const stocksQuery: QueryStocksDto = {
        year: 2022,
        company: 'GOOGLE',
      };
      const result = await repository.findStocksPricesGroupedByMonthAndAvgPrice(stocksQuery);

      // Assert
      expect(repository.$queryRaw).toHaveBeenCalledTimes(1);
      expect(repository.$queryRaw).toHaveBeenCalledWith(expect.anything());
      expect(result).toEqual(mockResult);
    });

    it('then return an empty array when no stocks match the provided filters', () => {
      // Mock the query result
      const mockResult: StocksPricesPerMonthDto[] = [];

      jest.spyOn(repository, '$queryRaw').mockResolvedValue(mockResult);

      // Call the method with filters
      const stocksQuery: QueryStocksDto = {
        year: 2022,
        company: 'ABC',
      };
      const result = repository.findStocksPricesGroupedByMonthAndAvgPrice(stocksQuery);

      // Assert the result
      expect(repository.$queryRaw).toHaveBeenCalledTimes(1);
      expect(repository.$queryRaw).toHaveBeenCalledWith(expect.anything());
      expect(result).resolves.toEqual(mockResult);
    });

    it('should throw a BadRequestException when the query fails', () => {
      // Mock the query to throw an error
      const mockError = new Error('Query failed');
      jest.spyOn(repository, '$queryRaw').mockRejectedValue(mockError);

      // Call the method with filters
      const stocksQuery: QueryStocksDto = {
        year: 2022,
        company: 'ABC',
      };
      const result = repository.findStocksPricesGroupedByMonthAndAvgPrice(stocksQuery);

      // Assert the result
      expect(repository.$queryRaw).toHaveBeenCalledTimes(1);
      expect(repository.$queryRaw).toHaveBeenCalledWith(expect.anything());
      expect(result).rejects.toThrow(BadRequestException);
    });
  })
});
