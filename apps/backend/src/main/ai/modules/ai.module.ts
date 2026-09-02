import { Module } from '@nestjs/common';

import { AiService } from '../logic/ai.service';
import { AiController } from '../controller/ai.controller';

@Module({
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
