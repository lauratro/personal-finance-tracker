import { AssetType } from '@prisma/client';
export declare class UpdateInvestmentHistoryDto {
    name?: string;
    assetType?: AssetType;
    boughtDate?: string;
    totalAmountInvested?: number;
    costSingleStock?: number;
    quantity?: number;
    plannedPriceToSell?: number;
    saleDate?: string | null;
    salePrice?: number | null;
}
