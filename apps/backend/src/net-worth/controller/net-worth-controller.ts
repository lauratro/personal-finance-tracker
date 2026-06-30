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
import { CreateNetWorthDto } from './../dto/create-net-worth.dto'; 
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateNetWorthService } from '../logic/create-net-worth-service';
import { GetNetWorthService } from '../logic/get-net-worth.service';
import { UpdateNetWorthDto } from '../dto/update-net-worth.dto';
import { UpdateNetWorthService } from '../logic/update-net-worth.service';  
import { DeleteNetWorthService } from '../logic/delete-net-worth-service';

@Controller('net-worth')
@UseGuards(JwtAuthGuard)
export class NetWorthController {
    constructor(
        private readonly createNetWorth: CreateNetWorthService,
        private readonly getNetWorth: GetNetWorthService,
        private readonly updateNetWorth: UpdateNetWorthService,
        private readonly deleteNetWorth: DeleteNetWorthService,
        
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser('sub') userId: string,
        @Body() createNetWorthDto: CreateNetWorthDto,
    ) {
        return this.createNetWorth.execute(userId, createNetWorthDto);
    }

    @Get()
    async findAll(@CurrentUser('sub') userId: string) {
        return this.getNetWorth.execute(userId);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateNetWorthDto: UpdateNetWorthDto,
    ) {
        return this.updateNetWorth.execute(id, updateNetWorthDto);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string
    ) {
        return this.deleteNetWorth.execute(id);
    }   

}