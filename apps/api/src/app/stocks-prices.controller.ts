import { Controller, Get, Query } from '@nestjs/common';
import { StocksPricesService } from './stocks-prices.service';
import { QueryStocksDto } from './dtos/query-stocks.dto';

@Controller('')
export class StocksPricesController {
  constructor(private readonly stocksPricesService: StocksPricesService) {}

  @Get()
  get(@Query() queryStocksDto: QueryStocksDto) {
    return this.stocksPricesService.findStocksPricesGroupedByMonthAndAvgPrice(queryStocksDto);
  }


  @Get('best-gain-of-the-year')
  bestGainOfTheYear(@Query() queryStocksDto: QueryStocksDto) {



  }
}
