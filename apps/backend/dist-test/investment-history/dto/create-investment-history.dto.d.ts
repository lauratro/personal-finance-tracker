import { AssetType } from '@prisma/client';
export declare class CreateInvestmentHistoryDto {
    name: string;
    assetType: AssetType;
    boughtDate: string;
    totalAmountInvested: number;
    costSingleStock: number;
    quantity: number;
    plannedPriceToSell?: number;
}
