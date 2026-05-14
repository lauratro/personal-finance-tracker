export enum AssetType {
  STOCK = 'STOCK',
  ETF = 'ETF',
  CRYPTO = 'CRYPTO',
  BOND = 'BOND',
  FUND = 'FUND',
  CASH = 'CASH',
  OTHER = 'OTHER',
}

export type InvestmentHistory = {
  id: string;
  userId: string;
  name: string;
  assetType: AssetType;
  boughtDate: string;
  totalAmountInvested: number;
  costSingleStock: number;
  quantity: number;
  plannedPriceToSell?: number;
  saleDate?: string | null;
  salePrice?: number | null;
  income?: number | null | string;
  percentageIncome?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvestmentHistoryPayload = {
  name: string;
  assetType: AssetType;
  boughtDate: string;
  totalAmountInvested: number;
  costSingleStock: number;
  quantity: number;
  plannedPriceToSell?: number;
};

export type UpdateInvestmentHistoryPayload = Partial<CreateInvestmentHistoryPayload> & {
  saleDate?: string | null;
  salePrice?: number | null;
};
