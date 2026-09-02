import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async generateResponse(@Body('prompt') prompt: string) {
    return this.aiService.generateResponse(prompt);
  }
}
