"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentHistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let InvestmentHistoryService = class InvestmentHistoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.investiment.create({
            data: {
                userId,
                name: dto.name,
                assetType: dto.assetType,
                boughtDate: new Date(dto.boughtDate),
                totalAmountInvested: new library_1.Decimal(dto.totalAmountInvested),
                costSingleStock: new library_1.Decimal(dto.costSingleStock),
                quantity: new library_1.Decimal(dto.quantity),
                plannedPriceToSell: dto.plannedPriceToSell
                    ? new library_1.Decimal(dto.plannedPriceToSell)
                    : null,
            },
        });
    }
    async findAllByUserId(userId) {
        return this.prisma.investiment.findMany({
            where: { userId },
            orderBy: { boughtDate: 'desc' },
        });
    }
    async findOne(id, userId) {
        return this.prisma.investiment.findFirst({
            where: { id, userId },
        });
    }
    async update(id, userId, dto) {
        const investment = await this.prisma.investiment.findFirst({
            where: { id, userId },
        });
        if (!investment) {
            throw new common_1.NotFoundException('Investment not found');
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.assetType !== undefined)
            data.assetType = dto.assetType;
        if (dto.boughtDate !== undefined)
            data.boughtDate = new Date(dto.boughtDate);
        if (dto.totalAmountInvested !== undefined)
            data.totalAmountInvested = new library_1.Decimal(dto.totalAmountInvested);
        if (dto.costSingleStock !== undefined)
            data.costSingleStock = new library_1.Decimal(dto.costSingleStock);
        if (dto.quantity !== undefined)
            data.quantity = new library_1.Decimal(dto.quantity);
        if (dto.plannedPriceToSell !== undefined)
            data.plannedPriceToSell = dto.plannedPriceToSell
                ? new library_1.Decimal(dto.plannedPriceToSell)
                : null;
        if (dto.saleDate !== undefined) {
            data.saleDate = dto.saleDate ? new Date(dto.saleDate) : null;
        }
        if (dto.salePrice !== undefined) {
            data.salePrice = dto.salePrice !== null ? new library_1.Decimal(dto.salePrice) : null;
        }
        const saleDate = data.saleDate ?? investment.saleDate;
        const salePrice = data.salePrice ?? investment.salePrice;
        if (saleDate && salePrice) {
            const totalRevenue = new library_1.Decimal(investment.quantity).mul(salePrice);
            data.income = totalRevenue.sub(investment.totalAmountInvested);
            data.percentageIncome = data.income
                .div(investment.totalAmountInvested)
                .mul(100);
        }
        return this.prisma.investiment.update({
            where: { id },
            data,
        });
    }
    async delete(id, userId) {
        const investment = await this.prisma.investiment.findFirst({
            where: { id, userId },
        });
        if (!investment) {
            throw new common_1.NotFoundException('Investment not found');
        }
        return this.prisma.investiment.delete({
            where: { id },
        });
    }
};
exports.InvestmentHistoryService = InvestmentHistoryService;
exports.InvestmentHistoryService = InvestmentHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvestmentHistoryService);
//# sourceMappingURL=investment-history.service.js.map