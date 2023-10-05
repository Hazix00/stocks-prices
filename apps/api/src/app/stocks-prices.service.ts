import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StocksPricesRepository } from './stocks-prices.repository';
import { QueryStocksDto } from './dtos/query-stocks.dto';
import { BestGain } from '@shared';
import { BestGainQueryDto } from './dtos/best-gain-query.dto';

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
  findStocksPricesGroupedByMonthAndAvgPrice(stocksQuery: QueryStocksDto = {}) {
    return this.stocksPricesRepository.findStocksPricesGroupedByMonthAndAvgPrice(
      stocksQuery
    );
  }

  async bestGainOfTheYear(bestGainQuery: BestGainQueryDto): Promise<BestGain> {
    const stockData = await this.stocksPricesRepository.find(bestGainQuery);

    if (!stockData || stockData.length < 2) {
      throw new InternalServerErrorException(
        'Insufficient data to find best buy and sell days.'
      );
    }

    let maxGain =
      stockData[0].highestPriceOfTheDay - stockData[0].lowestPriceOfTheDay;
    if (maxGain < 0) {
      maxGain = 0;
    }
    let buyDayIndex = 0;
    let sellDayIndex = 0;

    // Iterate through the stock data to find the best buy and sell days
    for (let buyIndex = 0; buyIndex < stockData.length - 1; buyIndex++) {
      for (
        let sellIndex = buyIndex + 1;
        sellIndex < stockData.length;
        sellIndex++
      ) {
        const buyPrice = stockData[buyIndex].lowestPriceOfTheDay;
        const sellPrice = stockData[sellIndex].highestPriceOfTheDay;
        const potentialGain = sellPrice - buyPrice;

        if (potentialGain > maxGain) {
          maxGain = potentialGain;
          buyDayIndex = buyIndex;
          sellDayIndex = sellIndex;
        }
      }
    }
    console.log('maxGain', maxGain);

    // Cast the timestamps to Number to avoid JSON.stringify() error : TypeError: Do not know how to serialize a BigInt
    stockData[buyDayIndex].timestamp = Number(stockData[buyDayIndex].timestamp) as unknown as bigint;
    stockData[sellDayIndex].timestamp = Number(stockData[sellDayIndex].timestamp) as unknown as bigint;

    // Return the best buy and sell days
    return { buyDay: stockData[buyDayIndex], sellDay: stockData[sellDayIndex] };
  }
}
