import { Injectable } from '@nestjs/common';
import { StocksPricesRepository } from './stocks-prices.repository';
import { QueryStocksDto } from './dtos/query-stocks.dto';

@Injectable()
export class StocksPricesService {
  constructor(
    private readonly stocksPricesRepository: StocksPricesRepository
  ) {}

  /**
   * The function "findStocksPricesGroupedByMonthAndAvgPrice" retrieves stock prices based on a query
   * and groups them by month, returning the average price for each month.
   * @param {QueryStocksDto} stocksQuery - The `stocksQuery` parameter is an object of type
   * `QueryStocksDto` which contains the query parameters for filtering the stocks prices.
   */
  findStocksPricesGroupedByMonthAndAvgPrice(
    stocksQuery: QueryStocksDto = {}
  ) {
    return this.stocksPricesRepository.findStocksPricesGroupedByMonthAndAvgPrice(
      stocksQuery
    );
  }
}
