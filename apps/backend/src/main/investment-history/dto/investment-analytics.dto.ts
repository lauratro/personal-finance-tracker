import { Type } from 'class-transformer';
import { IsInt, IsOptional} from 'class-validator';

export class InvestmentIncomeAnalyticsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;
}