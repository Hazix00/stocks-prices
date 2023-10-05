import { Controller, Get, Query } from '@nestjs/common';
import { StocksPricesService } from './stocks-prices.service';
import { QueryStocksDto } from './dtos/query-stocks.dto';
import { BestGainQueryDto } from './dtos/best-gain-query.dto';

@Controller('')
export class StocksPricesController {
  constructor(private readonly stocksPricesService: StocksPricesService) {}

  @Get()
  get(@Query() queryStocksDto: QueryStocksDto) {
    return this.stocksPricesService.findStocksPricesGroupedByMonthAndAvgPrice(queryStocksDto);
  }


  @Get('best-gain-of-the-year')
  bestGainOfTheYear(@Query() bestGainQuery: BestGainQueryDto) {
    return this.stocksPricesService.bestGainOfTheYear(bestGainQuery);
  }
}
