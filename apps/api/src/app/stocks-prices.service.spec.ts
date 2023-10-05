import { Test, TestingModule } from '@nestjs/testing';
import { StocksPricesService } from './stocks-prices.service';
import { StocksPricesRepository } from './stocks-prices.repository';
import { stocksPricesPerMonthStub } from '../test/stubs/stocks-prices-per-month.stubs';
import { stocksPricesStub } from '../test/stubs/stocks-prices.stubs';
import { InternalServerErrorException } from '@nestjs/common';
import { BestGain } from '@shared';

describe('StocksPricesService', () => {
  let service: StocksPricesService;
  let repository: StocksPricesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksPricesService,
        {
          provide: StocksPricesRepository,
          useValue: {
            findStocksPricesGroupedByMonthAndAvgPrice: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StocksPricesService>(StocksPricesService);
    repository = module.get<StocksPricesRepository>(StocksPricesRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('when calling findStocksPricesGroupedByMonthAndAvgPrice', () => {
    it('then should be defined', () => {
      expect(service.findStocksPricesGroupedByMonthAndAvgPrice).toBeDefined();
    });

    it('then return an array of StockPrice objects when no query is provided', async () => {
      // Mock
      const mockResult = stocksPricesPerMonthStub();

      jest
        .spyOn(repository, 'findStocksPricesGroupedByMonthAndAvgPrice')
        .mockResolvedValue(mockResult);

      // Call
      const result = await service.findStocksPricesGroupedByMonthAndAvgPrice();

      // Assert
      expect(
        repository.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledTimes(1);
      expect(
        repository.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledWith({});

      expect(result).toEqual(mockResult);
    });

    it("then return an array of StockPrice objects filtered by year when 'year' query parameter is provided", async () => {
      // Mock
      const mockResult = stocksPricesPerMonthStub().filter(
        (stockPrice) => stockPrice.year === 2022
      );
      const mockQuery = {
        year: 2022,
      };

      jest
        .spyOn(repository, 'findStocksPricesGroupedByMonthAndAvgPrice')
        .mockResolvedValue(mockResult);

      // Call
      const result = await service.findStocksPricesGroupedByMonthAndAvgPrice(
        mockQuery
      );

      // Assert
      expect(
        repository.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledTimes(1);
      expect(
        repository.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledWith(mockQuery);

      expect(result).toEqual(mockResult);
    });

    it("then return an array of StockPrice objects filtered by company when 'company' query parameter is provided", async () => {
      // Mock
      const mockResult = stocksPricesPerMonthStub().filter(
        (stockPrice) => stockPrice.company === 'GOOGLE'
      );
      const mockQuery = {
        company: 'GOOGLE',
      };

      jest
        .spyOn(repository, 'findStocksPricesGroupedByMonthAndAvgPrice')
        .mockResolvedValue(mockResult);

      // Call
      const result = await service.findStocksPricesGroupedByMonthAndAvgPrice(
        mockQuery
      );

      // Assert
      expect(
        repository.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledTimes(1);
      expect(
        repository.findStocksPricesGroupedByMonthAndAvgPrice
      ).toHaveBeenCalledWith(mockQuery);

      expect(result).toEqual(mockResult);
    });
  });

  describe('when calling bestGainOfTheYear', () => {
    const mockQuery = {
      year: 2022,
      company: 'GOOGLE',
    };
    it('should be defined', () => {
      expect(service.bestGainOfTheYear).toBeDefined();
    });

    it('then return the best buy and sell days', async () => {
      // Mock
      const mockFindResult = stocksPricesStub().filter(
        (item) => item.company === mockQuery.company
      );
      const mockResult: BestGain = {
        buyDay: mockFindResult[0],
        sellDay: mockFindResult[1],
      };

      jest.spyOn(repository, 'find').mockResolvedValue(mockFindResult);

      // Call
      const result = await service.bestGainOfTheYear(mockQuery);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith(mockQuery);

      expect(result).toEqual(mockResult);
    });

    it('then throw an error if no data is found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      // Call
      try {
        await service.bestGainOfTheYear(mockQuery);
        fail('Expected an error to be thrown');
      } catch (error) {
        // Assert
        expect(repository.find).toHaveBeenCalledTimes(1);
        expect(repository.find).toHaveBeenCalledWith(mockQuery);

        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
