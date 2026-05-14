"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const investment_history_service_1 = require("./investment-history.service");
const investment_history_controller_1 = require("./investment-history.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let InvestmentHistoryModule = class InvestmentHistoryModule {
};
exports.InvestmentHistoryModule = InvestmentHistoryModule;
exports.InvestmentHistoryModule = InvestmentHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [investment_history_controller_1.InvestmentHistoryController],
        providers: [investment_history_service_1.InvestmentHistoryService],
    })
], InvestmentHistoryModule);
//# sourceMappingURL=investment-history.module.js.map