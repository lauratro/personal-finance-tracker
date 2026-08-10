import { IsString, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { AssetType } from '@prisma/client';

export class CreateInvestmentHistoryDto {
  @IsString()
  name!: string;

  @IsEnum(AssetType)
  assetType!: AssetType;

  @IsDateString()
  boughtDate!: string;

  @IsNumber()
  totalAmountInvested!: number;

  @IsNumber()
  costSingleStock!: number;

  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsNumber()
  plannedPriceToSell?: number;
}
