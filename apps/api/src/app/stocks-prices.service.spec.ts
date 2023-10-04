import { Test, TestingModule } from '@nestjs/testing';
import { StocksPricesService } from './stocks-prices.service';
import { StocksPricesRepository } from './stocks-prices.repository';
import { stocksPricesPerMonthStub } from '../test/stubs/stocks-prices-per-month.stubs';

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
});
