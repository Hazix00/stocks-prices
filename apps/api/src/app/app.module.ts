import { Module } from '@nestjs/common';
import { StocksPricesService } from './stocks-prices.service';
import { StocksPricesRepository } from './stocks-prices.repository';
import { StocksPricesController } from './stocks-prices.controller';

@Module({
  imports: [],
  controllers: [StocksPricesController],
  providers: [StocksPricesService, StocksPricesRepository],
})
export class AppModule {}
