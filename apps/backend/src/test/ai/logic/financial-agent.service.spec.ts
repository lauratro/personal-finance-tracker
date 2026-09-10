import { FinancialAgentService } from '../../../main/ai/logic/financial-agent.service';
import {
  mockGetNetWorthsService,
  mockAiService,
  mockListInvestmentsService,
} from '../mock/ai.service.mock';
import { AiService } from '../../../main/ai/logic/ai.service';
import { GetNetWorthsService } from '../../../main/net-worth/logic/get-net-worths.service';
import { ListInvestmentsService } from '../../../main/investment-history/logic/list-investments.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('FinancialAgentService', () => {
  let service: FinancialAgentService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new FinancialAgentService(
      mockAiService as unknown as AiService,
      mockGetNetWorthsService as unknown as GetNetWorthsService,
      mockListInvestmentsService as unknown as ListInvestmentsService,
    );
  });

  it('should execute getInvestments when requested by the AI', async () => {
    const functionCall = {
      name: 'getInvestments',
      args: {},
    };

    const aiResponse = {
      functionCalls: [functionCall],
    };

    const investments = [
      {
        id: 'investment-1',
        name: 'Microsoft',
      },
    ];

    mockAiService.generateWithTools.mockResolvedValue(aiResponse);

    mockListInvestmentsService.execute.mockResolvedValue(investments);

    mockAiService.generateAfterToolCall.mockResolvedValue(
      'Microsoft has a positive performance.',
    );

    const result = await service.chat(
      'How are my investments performing?',
      'user-1',
    );

    expect(mockListInvestmentsService.execute).toHaveBeenCalledWith('user-1');

    expect(mockAiService.generateAfterToolCall).toHaveBeenCalledWith(
      'How are my investments performing?',
      aiResponse,
      functionCall,
      investments,
    );

    expect(result).toBe('Microsoft has a positive performance.');
  });

  it('should execute getNetWorth when requested by the AI', async () => {
    const functionCall = {
      name: 'getNetWorthHistory',
      args: {},
    };

    const aiResponse = {
      functionCalls: [functionCall],
    };

    const netWorthItem = {
      id: 'item-1',
      name: 'bank',
    };

    const netWorth = {
      id: 'networth-1',
      items: [netWorthItem],
    };

    mockAiService.generateWithTools.mockResolvedValue(aiResponse);

    mockGetNetWorthsService.execute.mockResolvedValue(netWorth);

    mockAiService.generateAfterToolCall.mockResolvedValue(
      'This is your net worth',
    );

    const result = await service.chat('What it my net worth?', 'user-1');

    expect(mockGetNetWorthsService.execute).toHaveBeenCalledWith(
      'user-1',
      'desc',
    );

    expect(mockAiService.generateAfterToolCall).toHaveBeenCalledWith(
      'What it my net worth?',
      aiResponse,
      functionCall,
      netWorth,
    );
    expect(result).toBe('This is your net worth');
  });

  it('should throw an exception if it cannot find the tool', async () => {
    const functionCall = {
      name: 'unsupported tool',
      args: {},
    };

    const response = {
      functionCalls: [functionCall],
    };

    mockAiService.generateWithTools.mockResolvedValue(response);

    await expect(
      service.chat('How are my investments?', 'user-1'),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
