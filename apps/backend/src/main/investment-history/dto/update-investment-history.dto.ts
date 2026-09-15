import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { AssetType } from '@prisma/client';

export class UpdateInvestmentHistoryDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AssetType)
  assetType?: AssetType;

  @IsOptional()
  @IsDateString()
  boughtDate?: string;

  @IsOptional()
  @IsPositive()
  totalAmountInvested?: number;

  @IsOptional()
  @IsPositive()
  costSingleStock?: number;

  @IsOptional()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsPositive()
  plannedPriceToSell?: number;

  @IsOptional()
  @IsDateString()
  saleDate?: string | null;

  @IsOptional()
  @IsPositive()
  salePrice?: number | null;

  @IsOptional()
  @IsNumber()
  taxes?: number | null;
}
