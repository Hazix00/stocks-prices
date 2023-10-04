import { StockPrice } from '@prisma/client';
import { PrismaService } from './common/prisma.service';
import { QueryStocksDto } from './dtos/query-stocks.dto';

export class StocksPricesRepository extends PrismaService {
  /**
   * The function `find` retrieves stock prices based on the provided query parameters.
   * @param {QueryStocksDto} query - The `query` parameter is an object of type `QueryStocksDto`. It is
   * an optional parameter that can contain the following properties:
   * 'company': string,
   * 'year': number
   * @returns a Promise that resolves to an array of StockPrice objects.
   */
  find(query: QueryStocksDto = {}): Promise<StockPrice[]> {
    const filterQuery = {};
    if (query.year) {
      //get every stock with timestamp between the start and end of the year
      filterQuery['timestamp'] = {
        gte: new Date(`${query.year}-01-01T00:00:00Z`).getTime(),
        lt: new Date(`${query.year + 1}-01-01T00:00:00Z`).getTime(),
      };
    }
    if (query.company) {
      filterQuery['company'] = query.company;
    }

    return this.stockPrice.findMany({
      where: filterQuery,
    });
  }
}
