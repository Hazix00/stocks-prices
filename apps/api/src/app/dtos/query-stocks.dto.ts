import { StockPrice } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDefined, IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryStocksDto implements Partial<Pick<StockPrice, 'company'>> {
  @IsOptional()
  @IsString()
  @IsDefined()
  company?: string;

  @IsOptional()
  @IsDefined()
  @Transform(({ value }) => Number(value))
  year?: number;
}
