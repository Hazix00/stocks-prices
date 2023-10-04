import { StockPrice } from '@prisma/client';
import { IsDefined, IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryStocksDto implements Partial<Pick<StockPrice, 'company'>> {
  @IsOptional()
  @IsString()
  @IsDefined()
  company?: string;

  @IsOptional()
  @IsDefined()
  @IsPositive()
  year?: number;
}
