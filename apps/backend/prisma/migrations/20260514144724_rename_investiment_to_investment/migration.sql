/*
  Warnings:

  - You are about to drop the `Investiment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Investiment" DROP CONSTRAINT "Investiment_userId_fkey";

-- DropTable
DROP TABLE "Investiment";

-- CreateTable
CREATE TABLE "Investment" (
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

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Investment_userId_idx" ON "Investment"("userId");

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
