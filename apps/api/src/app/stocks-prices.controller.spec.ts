import { Test, TestingModule } from '@nestjs/testing';
import { StocksPricesController } from './stocks-prices.controller';
import { StocksPricesService } from './stocks-prices.service';
import { stocksPricesPerMonthStub } from '../test/stubs/stocks-prices-per-month.stubs';
import { QueryStocksDto } from './dtos/query-stocks.dto';
import { BestGainQueryDto } from './dtos/best-gain-query.dto';
import { async } from 'rxjs';
import { stocksPricesStub } from '../test/stubs/stocks-prices.stubs';
import { BestGain } from '@shared';
import { InternalServerErrorException } from '@nestjs/common';

describe('StocksPricesController', () => {
  let controller: StocksPricesController;
  let service: StocksPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksPricesController],
      providers: [
        {
          provide: StocksPricesService,
          useValue: {
            findStocksPricesGroupedByMonthAndAvgPrice: jest.fn(),
            bestGainOfTheYear: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(StocksPricesController);
    service = module.get(StocksPricesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when calling get', () => {
    it('then should be defined', () => {
      expect(controller.get).toBeDefined();
    });

    it('then return an array of StockPrices per month objects when no query is provided', async () => {
      // Mock
      const mockResult = stocksPricesPerMonthStub();

      jest
        .spyOn(service, 'findStocksPricesGroupedByMonthAndAvgPrice')
        .mockResolvedValue(mockResult);

      // Call
      const result = await controller.get({});

      // Assert
      expect(
        service.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledTimes(1);
      expect(
        service.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledWith({});

      expect(result).toEqual(mockResult);
    });

    it("then return an array of StockPrices per month objects filtered by company when 'company' query parameter is provided", async () => {
      // Mock the query result
      const stubs = stocksPricesPerMonthStub().filter(
        (stockPrice) => stockPrice.company === 'GOOGLE'
      );
      const query: QueryStocksDto = {
        company: 'GOOGLE',
      };

      //Mock the return result of findMany method
      jest
        .spyOn(service, 'findStocksPricesGroupedByMonthAndAvgPrice')
        .mockResolvedValue(stubs);

      // Call
      const result = await controller.get(query);

      // Assert
      expect(
        service.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledTimes(1);
      expect(
        service.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledWith(query);

      expect(result).toEqual(stubs);
    });

    it("then return an array of StockPrices per month objects filtered by year when 'year' query parameter is provided", async () => {
      // Mock the query result
      const stubs = stocksPricesPerMonthStub().filter(
        (stockPrice) => stockPrice.year === 2022
      );
      const query: QueryStocksDto = {
        year: 2022,
      };

      //Mock the return result of findMany method
      jest
        .spyOn(service, 'findStocksPricesGroupedByMonthAndAvgPrice')
        .mockResolvedValue(stubs);

      // Call
      const result = await controller.get(query);

      // Assert
      expect(
        service.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledTimes(1);
      expect(
        service.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledWith(query);

      expect(result).toEqual(stubs);
    });
  });

  describe('when calling bestGainOfTheYear', () => {
    const mockQuery = {
      year: 2022,
      company: 'GOOGLE',
    };
    it('then should be defined', () => {
      expect(controller.bestGainOfTheYear).toBeDefined();
    });

    it('return the best buy and sell days', async () => {
      // Mock
      const mockFindResult = stocksPricesStub().filter(
        (item) => item.company === mockQuery.company
      );
      const mockResult: BestGain = {
        buyDay: mockFindResult[0],
        sellDay: mockFindResult[1],
      };

      jest.spyOn(service, 'bestGainOfTheYear').mockResolvedValue(mockResult);

      // Call
      const result = await controller.bestGainOfTheYear(mockQuery);

      // Assert
      expect(service.bestGainOfTheYear).toHaveBeenCalledTimes(1);
      expect(service.bestGainOfTheYear).toHaveBeenCalledWith(mockQuery);

      expect(result).toEqual(mockResult);
    });

    it('then throw an error if no data is found', async () => {
      jest
        .spyOn(service, 'bestGainOfTheYear')
        .mockRejectedValue(
          new InternalServerErrorException(
            'Insufficient data to find best buy and sell days.'
          )
        );
      // Call
      try {
        await controller.bestGainOfTheYear(mockQuery);
      }
      catch (error) {
        // Assert
        expect(service.bestGainOfTheYear).toHaveBeenCalledTimes(1);
        expect(service.bestGainOfTheYear).toHaveBeenCalledWith(mockQuery);
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
