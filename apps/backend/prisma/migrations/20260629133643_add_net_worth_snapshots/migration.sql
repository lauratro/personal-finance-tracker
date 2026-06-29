-- CreateEnum
CREATE TYPE "NetWorthCategory" AS ENUM ('CHECKING_ACCOUNT', 'SAVINGS_ACCOUNT', 'INVESTMENTS', 'CASH', 'CRYPTO', 'REAL_ESTATE', 'OTHER');

-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "percentageIncome" SET DATA TYPE DECIMAL(18,2);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "budgetMonthId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AccountType" NOT NULL,
    "value" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetWorthSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetWorthSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetWorthItem" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "NetWorthCategory" NOT NULL,
    "value" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetWorthItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BudgetItem_budgetMonthId_category_idx" ON "BudgetItem"("budgetMonthId", "category");

-- CreateIndex
CREATE INDEX "NetWorthSnapshot_userId_monthStart_idx" ON "NetWorthSnapshot"("userId", "monthStart");

-- CreateIndex
CREATE UNIQUE INDEX "NetWorthSnapshot_userId_monthStart_key" ON "NetWorthSnapshot"("userId", "monthStart");

-- CreateIndex
CREATE INDEX "NetWorthItem_snapshotId_category_idx" ON "NetWorthItem"("snapshotId", "category");

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_budgetMonthId_fkey" FOREIGN KEY ("budgetMonthId") REFERENCES "BudgetMonth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetWorthSnapshot" ADD CONSTRAINT "NetWorthSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetWorthItem" ADD CONSTRAINT "NetWorthItem_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "NetWorthSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
