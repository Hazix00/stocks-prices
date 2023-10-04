import { Prisma, StockPrice } from '@prisma/client';
import { PrismaService } from './common/prisma.service';
import { QueryStocksDto } from './dtos/query-stocks.dto';
import { StocksPricesPerMonthDto } from '@shared';
import { BadRequestException, Logger } from '@nestjs/common';

export class StocksPricesRepository extends PrismaService {

  logger = new Logger(StocksPricesRepository.name);
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

  /**
   * The function `findStocksPricesGroupedByMonthAndAvgPrice` retrieves the average prices of stocks
   * grouped by month and company, based on the provided year and company filters.
   * @param {QueryStocksDto} stocksQuery - The `stocksQuery` parameter is an object that contains the
   * following properties:
   * 'year': number
   * 'company': string
   * @returns a Promise that resolves to an array of objects of type StocksPricesPerMonthDto.
   */
  async findStocksPricesGroupedByMonthAndAvgPrice(
    stocksQuery: QueryStocksDto = {}
  ): Promise<StocksPricesPerMonthDto[]> {
    const { year, company } = stocksQuery;
    let query = `
      WITH MonthlyStocks AS (
          SELECT
            EXTRACT(MONTH FROM TO_TIMESTAMP(timestamp / 1000)) :: INTEGER AS month,
            EXTRACT(YEAR FROM TO_TIMESTAMP(timestamp / 1000)) :: INTEGER AS year,
            company,
            AVG(("lowestPriceOfTheDay" + "highestPriceOfTheDay") / 2) AS avgAvgPriceOfMonth
          FROM public."${process.env.TABLE}"`;

    if (year) {
      query += ` WHERE EXTRACT(YEAR FROM TO_TIMESTAMP(timestamp / 1000)) = ${year}`;
    }

    if (company) {
      query += year ? ' AND ' : ' WHERE ';
      query += `company = '${company}'`;
    }

    query += `
          GROUP BY
            company,
            timestamp
      )
      SELECT
        company,
        month,
        AVG(avgAvgPriceOfMonth) AS avgPrice,
        year
      FROM
          MonthlyStocks
      GROUP BY
        month,
        company,
        year
      ORDER BY
          month;
    `;

    console.log(query);

    try {
      return await this.$queryRaw(Prisma.raw(query));
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }

  }
}
