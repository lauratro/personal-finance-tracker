-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('STOCK', 'ETF', 'CRYPTO', 'BOND', 'FUND', 'CASH', 'OTHER');

-- CreateTable
CREATE TABLE "InvestmentHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT,
    "assetType" "AssetType" NOT NULL,
    "boughtDate" TIMESTAMP(3) NOT NULL,
    "totalAmountInvested" NUMERIC(18,2) NOT NULL,
    "costSingleStock" NUMERIC(18,4) NOT NULL,
    "quantity" NUMERIC(24,8) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "plannedPriceToSell" NUMERIC(18,4),
    "soldDate" TIMESTAMP(3),
    "soldAtPrice" NUMERIC(18,4),
    "earningsAmount" NUMERIC(18,2),
    "earningsPercentage" NUMERIC(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentHistory_userId_symbol_boughtDate_key" ON "InvestmentHistory"("userId", "symbol", "boughtDate");

-- CreateIndex
CREATE INDEX "InvestmentHistory_userId_boughtDate_idx" ON "InvestmentHistory"("userId", "boughtDate");

-- CreateIndex
CREATE INDEX "InvestmentHistory_userId_soldDate_idx" ON "InvestmentHistory"("userId", "soldDate");

-- AddForeignKey
ALTER TABLE "InvestmentHistory" ADD CONSTRAINT "InvestmentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
