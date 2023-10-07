import { BestGain, StocksPricesPerMonthDto } from '@shared';
import http from '../../common/http';

export class StocksService {
  private static instance: StocksService;
  private constructor() {}

  public static getInstance() {
    if (!StocksService.instance) {
      StocksService.instance = new StocksService();
    }
    return StocksService.instance;
  }

  async getStocksByCompanyAndYear(company: string, year: number) {
    const params = { company, year };
    return http.get<StocksPricesPerMonthDto[]>('', { params });
  }

  async getBestGain(company: string, year: number) {
    const params = { company, year };
    return http.get<BestGain>('/best-gain-of-the-year', { params });
  }
}
