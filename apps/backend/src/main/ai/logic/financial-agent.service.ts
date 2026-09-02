import { Injectable } from '@nestjs/common';
import { FunctionDeclaration, Type } from '@google/genai';
import { GetNetWorthsService } from '../../net-worth/logic/get-net-worths.service';
import { AiService } from './ai.service';

@Injectable()
export class FinancialAgentService {
  constructor(
    private readonly aiService: AiService,
    private readonly getNetWorthsService: GetNetWorthsService,
  ) {}

  private readonly getNetWorthHistoryTool: FunctionDeclaration = {
    name: 'getNetWorthHistory',
    description:
      "Get the authenticated user's net worth history, including the items contained in each snapshot.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sortDirection: {
          type: Type.STRING,
          description:
            'Sort snapshots from oldest to newest or newest to oldest.',
          enum: ['asc', 'desc'],
        },
      },
    },
  };

  async chat(prompt: string, userId: string) {
    const response = await this.aiService.generateWithTools(prompt, [
      this.getNetWorthHistoryTool,
    ]);

    const functionCalls = response.functionCalls;
    if (!functionCalls) {
      return response.text ?? '';
    }
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0];
      if (functionCall.name === 'getNetWorthHistory') {
        const sortDirection = functionCall.args?.sortDirection || 'desc';
        const netWorthHistory = await this.getNetWorthsService.execute(
          userId,
          sortDirection as 'asc' | 'desc',
        );
        console.log(netWorthHistory);
      }
    }
    return '';
  }
}
