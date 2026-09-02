import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from '../logic/ai.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { FinancialAgentService } from '../logic/financial-agent.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly financialAgentService: FinancialAgentService,
  ) {}

  @Post('chat')
  async chat(
    @CurrentUser('sub') userId: string,
    @Body('prompt') prompt: string,
  ) {
    return this.financialAgentService.chat(prompt, userId);
  }
}
