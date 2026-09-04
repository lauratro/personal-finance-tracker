import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FunctionDeclaration, Type } from '@google/genai';
import { GetNetWorthsService } from '../../net-worth/logic/get-net-worths.service';
import { AiService } from './ai.service';
import { SortDirectionType } from '../../net-worth/schema/types/sortDirectionTypes';

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

    const functionCall = response.functionCalls?.[0];

    if (!functionCall) {
      return response.text ?? '';
    }

    if (functionCall.name === 'getNetWorthHistory') {
      const sortDirection: SortDirectionType =
        functionCall.args?.sortDirection === 'asc' ? 'asc' : 'desc';

      const netWorthHistory = await this.getNetWorthsService.execute(
        userId,
        sortDirection,
      );

      const finalResponse = await this.aiService.generateAfterToolCall(
        prompt,
        response,
        functionCall,
        netWorthHistory,
      );

      return finalResponse;
    }

    throw new InternalServerErrorException(
      `Unsupported AI tool: ${functionCall.name}`,
    );
  }
}
