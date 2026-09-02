import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { CreateNetWorthItemService } from './../logic/create-net-worth-item-service';
import { CreateNetWorthService } from '../logic/create-net-worth-service';
import { UpdateNetWorthItemService } from './../logic/update-net-worth-item-service';
import { UpdateNetWorthService } from '../logic/update-net-worth.service';
import { DeleteNetWorthService } from '../logic/delete-net-worth-service';
import { DeleteNetWorthItemService } from './../logic/delete-net-worth-item-service';
import { GetNetWorthItemService } from './../logic/get-net-worth-item.service';
import { GetNetWorthsService } from '../logic/get-net-worths.service';
import { NetWorthItemController } from '../controller/net-worth-item.controller';
import { NetWorthController } from '../controller/net-worth-controller';
import { GetNetWorthBasedOnYearService } from '../logic/get-net-worth-based-on-year-service';
import { GetNetWorthYearsListService } from '../logic/get-net-worth-years-list-service';
import { GetLastNetWorthIndicatorsService } from '../logic/get-last-net-wort-indicators-service';

@Module({
  imports: [PrismaModule],
  controllers: [NetWorthController, NetWorthItemController],
  providers: [
    CreateNetWorthService,
    UpdateNetWorthService,
    DeleteNetWorthService,
    GetNetWorthsService,
    GetNetWorthBasedOnYearService,
    CreateNetWorthItemService,
    UpdateNetWorthItemService,
    DeleteNetWorthItemService,
    GetNetWorthItemService,
    GetNetWorthYearsListService,
    GetLastNetWorthIndicatorsService,
  ],
  exports: [GetNetWorthsService],
})
export class NetWorthModule {}
