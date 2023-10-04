import { Test, TestingModule } from '@nestjs/testing';
import { StocksPricesController } from './stocks-prices.controller';
import { StocksPricesService } from './stocks-prices.service';
import { stocksPricesPerMonthStub } from '../test/stubs/stocks-prices-per-month.stubs';
import { QueryStocksDto } from './dtos/query-stocks.dto';

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
});
