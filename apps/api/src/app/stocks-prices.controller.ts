import { Controller, Get, Query } from '@nestjs/common';
import { StocksPricesService } from './stocks-prices.service';
import { StockPrice } from '@prisma/client';

@Controller('')
export class StocksPricesController {
  constructor(private readonly stocksPricesService: StocksPricesService) {}

  @Get()
  get(@Query() stocksDto: Partial<StockPrice>) {

  }

  bestGainOfTheYear(@Query() stocksDto: Partial<StockPrice>) {

  }
}
