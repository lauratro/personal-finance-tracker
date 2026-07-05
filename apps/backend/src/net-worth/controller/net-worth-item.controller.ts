import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateNetWorthItemDto } from '../dto/create-net-worth.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateNetWorthItemService } from '../logic/create-net-worth-item-service';
import { UpdateNetWorthItemService } from '../logic/update-net-worth-item-service';
import { UpdateNetWorthItemDto } from '../dto/update-net-worth.dto';
import { GetNetWorthItemService } from '../logic/get-net-worth-item.service';
import { DeleteNetWorthItemService } from '../logic/delete-net-worth-item-service';

@Controller('net-worth/:snapshotId/items')
@UseGuards(JwtAuthGuard)
export class NetWorthItemController {
    constructor(
        private readonly createNetWorthItem: CreateNetWorthItemService,
        private readonly updateNetWorthItem: UpdateNetWorthItemService,
        private readonly getNetWorthItem: GetNetWorthItemService,
        private readonly deleteNetWorthItem: DeleteNetWorthItemService,
    
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Param('snapshotId') snapshotId: string,
        @Body() createNetWorthItemDto: CreateNetWorthItemDto,
    ) {
        return this.createNetWorthItem.execute(snapshotId, createNetWorthItemDto);
    }

    @Patch(':itemId')
    async update(
        @Param('itemId') itemId: string,
        @Body() updateNetWorthItemDto: UpdateNetWorthItemDto,
    ) {
        return this.updateNetWorthItem.execute(itemId, updateNetWorthItemDto);
    }
    

    @Get(':itemId')
    async findOne(
        @Param('itemId') itemId: string,
    ) {
        return this.getNetWorthItem.execute(itemId);
    }


  @Delete(':itemId')
  async remove(
    @Param("itemId") itemId: string
  ) {
    return this.deleteNetWorthItem.execute(itemId);
  }
}