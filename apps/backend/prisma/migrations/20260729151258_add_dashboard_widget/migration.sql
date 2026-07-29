/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BudgetCategoryLimit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BudgetItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BudgetMonth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Holding` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketSnapshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Portfolio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetCategoryLimit" DROP CONSTRAINT "BudgetCategoryLimit_budgetMonthId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetCategoryLimit" DROP CONSTRAINT "BudgetCategoryLimit_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetItem" DROP CONSTRAINT "BudgetItem_budgetMonthId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetMonth" DROP CONSTRAINT "BudgetMonth_userId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "MarketSnapshot" DROP CONSTRAINT "MarketSnapshot_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_brokerAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "BudgetCategoryLimit";

-- DropTable
DROP TABLE "BudgetItem";

-- DropTable
DROP TABLE "BudgetMonth";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Holding";

-- DropTable
DROP TABLE "MarketSnapshot";

-- DropTable
DROP TABLE "Portfolio";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "CategoryType";

-- DropEnum
DROP TYPE "MarketDataProvider";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardWidget" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "minWidth" INTEGER,
    "maxWidth" INTEGER,
    "minHeight" INTEGER,
    "maxHeight" INTEGER,
    "configuration" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardWidget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_userId_key" ON "Dashboard"("userId");

-- CreateIndex
CREATE INDEX "DashboardWidget_id_idx" ON "DashboardWidget"("id");

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardWidget" ADD CONSTRAINT "DashboardWidget_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
