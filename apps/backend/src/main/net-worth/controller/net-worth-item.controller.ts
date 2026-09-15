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
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';

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
    @CurrentUserId() userId: string,
    @Param('snapshotId') snapshotId: string,
    @Body() createNetWorthItemDto: CreateNetWorthItemDto,
  ) {
    return this.createNetWorthItem.execute(
      userId,
      snapshotId,
      createNetWorthItemDto,
    );
  }

  @Patch(':itemId')
  async update(
    @CurrentUserId() userId: string,
    @Param('itemId') itemId: string,
    @Body() updateNetWorthItemDto: UpdateNetWorthItemDto,
  ) {
    return this.updateNetWorthItem.execute(
      userId,
      itemId,
      updateNetWorthItemDto,
    );
  }

  @Get(':itemId')
  async findOne(
    @CurrentUserId() userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.getNetWorthItem.execute(userId, itemId);
  }

  @Delete(':itemId')
  async remove(
    @CurrentUserId() userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.deleteNetWorthItem.execute(userId, itemId);
  }
}
