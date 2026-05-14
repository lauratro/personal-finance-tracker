/*
  Warnings:

  - You are about to drop the `InvestmentHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvestmentHistory" DROP CONSTRAINT "InvestmentHistory_userId_fkey";

-- DropTable
DROP TABLE "InvestmentHistory";

-- CreateTable
CREATE TABLE "Investiment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "boughtDate" TIMESTAMP(3) NOT NULL,
    "totalAmountInvested" DECIMAL(18,2) NOT NULL,
    "costSingleStock" DECIMAL(18,4) NOT NULL,
    "quantity" DECIMAL(24,8) NOT NULL,
    "plannedPriceToSell" DECIMAL(18,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "saleDate" TIMESTAMP(3),
    "salePrice" DECIMAL(18,4),
    "income" DECIMAL(18,2),
    "percentageIncome" DECIMAL(5,2),

    CONSTRAINT "Investiment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Investiment_userId_idx" ON "Investiment"("userId");

-- AddForeignKey
ALTER TABLE "Investiment" ADD CONSTRAINT "Investiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
