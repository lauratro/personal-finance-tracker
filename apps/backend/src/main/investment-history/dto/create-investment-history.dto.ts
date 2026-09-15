import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { AssetType } from '@prisma/client';

export class CreateInvestmentHistoryDto {
  @IsString()
  name!: string;

  @IsEnum(AssetType)
  assetType!: AssetType;

  @IsDateString()
  boughtDate!: string;

  @IsPositive()
  totalAmountInvested!: number;

  @IsPositive()
  costSingleStock!: number;

  @IsPositive()
  quantity!: number;

  @IsOptional()
  @IsPositive()
  plannedPriceToSell?: number;
}
