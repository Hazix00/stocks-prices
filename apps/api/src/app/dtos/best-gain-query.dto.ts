import { IQueryStocksDto } from '@shared';
import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class BestGainQueryDto implements Required<IQueryStocksDto> {
  @IsDefined()
  @Transform((value) => Number(value.value))
  @IsPositive()
  year: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  company: string;
}
