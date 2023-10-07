import { StocksService } from './stocks-prices.service';
import http from '../../common/http';
import { stocksPricesPerMonthStubs } from './test/stubs/stocks-prices-per-month.stubs';

// Mock the Axios module to intercept HTTP requests
jest.mock('../../common/http');

// Mock the Axios instance
const mockedHttp = http as jest.Mocked<typeof http>;

describe('StocksService', () => {
  let stocksService: StocksService;

  beforeEach(() => {
    stocksService = StocksService.getInstance();
  });

  afterEach(() => {
    // Reset all mock calls and instance state
    jest.clearAllMocks();
  });

  describe('when calling getStocksByCompanyAndYear', () => {

    it('then fetch stocks by company and year', async () => {
      // Mock successful HTTP response
      const mockData = stocksPricesPerMonthStubs();
      mockedHttp.get.mockResolvedValue({ data: mockData });

      const company = 'GOOGLE';
      const year = 2022;

      const result = await stocksService.getStocksByCompanyAndYear(company, year);

      expect(result.data).toEqual(mockData);
      expect(mockedHttp.get).toHaveBeenCalledWith('', {
        params: { company, year },
      });
    });

    it('then handle HTTP request error', async () => {
      // Mock HTTP request error
      const errorMessage = 'Network Error';
      mockedHttp.get.mockRejectedValue(new Error(errorMessage));

      const company = 'GOOGLE';
      const year = 2022;

      try {
        await stocksService.getStocksByCompanyAndYear(company, year);
        // Expecting an error to be thrown, so this line should not be reached
        expect(true).toBe(false);
      } catch (error) {

        expect((error as Error).message).toBe(errorMessage);
      }
    });
  })

});
