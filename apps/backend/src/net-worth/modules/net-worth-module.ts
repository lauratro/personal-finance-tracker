import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CreateNetWorthItemService } from './../logic/create-net-worth-item-service';
import { CreateNetWorthService } from '../logic/create-net-worth-service';
import { UpdateNetWorthItemService } from './../logic/update-net-worth-item-service';
import { UpdateNetWorthService } from '../logic/update-net-worth.service';
import { DeleteNetWorthService } from '../logic/delete-net-worth-service';
import { DeleteNetWorthItemService } from './../logic/delete-net-worth-item-service';
import { GetNetWorthItemService } from './../logic/get-net-worth-item.service';
import { GetNetWorthService } from '../logic/get-net-worth.service';
import { NetWorthItemController } from '../controller/net-worth-item.controller';
import { NetWorthController } from '../controller/net-worth-controller';
import { GetNetWorthBasedOnYearService } from '../logic/get-net-worth-based-on-year-service';
import { GetNetWorthYearsListService } from '../logic/get-net-worth-years-list-service';

@Module({
  imports: [PrismaModule],
  controllers: [NetWorthController, NetWorthItemController],
  providers: [
    CreateNetWorthService,
    UpdateNetWorthService,
    DeleteNetWorthService,
    GetNetWorthService,
    GetNetWorthBasedOnYearService,
    CreateNetWorthItemService,
    UpdateNetWorthItemService,
    DeleteNetWorthItemService,
    GetNetWorthItemService,
    GetNetWorthYearsListService,
  ],
})
export class NetWorthModule {}