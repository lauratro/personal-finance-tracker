import { IsString, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { AssetType } from '@prisma/client';

export class UpdateInvestmentHistoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AssetType)
  assetType?: AssetType;

  @IsOptional()
  @IsDateString()
  boughtDate?: string;

  @IsOptional()
  @IsNumber()
  totalAmountInvested?: number;

  @IsOptional()
  @IsNumber()
  costSingleStock?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  plannedPriceToSell?: number;

  @IsOptional()
  @IsDateString()
  saleDate?: string | null;

  @IsOptional()
  @IsNumber()
  salePrice?: number | null;

  @IsOptional()
  @IsNumber()
  taxes?: number | null;
}
