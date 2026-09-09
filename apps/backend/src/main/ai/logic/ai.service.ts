import {
  HttpException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { TooManyRequestsException } from '../../common/exceptions/TooManyRequestsException';
import { ConfigService } from '@nestjs/config';
import {
  FunctionDeclaration,
  GoogleGenAI,
  GenerateContentResponse,
  FunctionCall,
  ThinkingLevel,
} from '@google/genai';
import { AiEmptyResponseException } from '../exceptions/AiEmptyResponseException';

@Injectable()
export class AiService {
  private readonly client: GoogleGenAI;
  private readonly model: string;
  private readonly systemInstruction = `
    You are a financial assistant for a personal finance application.

    Respond clearly and concisely.
    Use plain text only.
    Do not use Markdown formatting.
    Do not use Markdown syntax such as **bold**, headings, or Markdown lists.
`;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');

    this.model = this.configService.getOrThrow<string>('GEMINI_MODEL');

    this.client = new GoogleGenAI({
      apiKey,
    });
  }

  async generateWithTools(prompt: string, tools: FunctionDeclaration[]) {
    try {
      return this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction: this.systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
          tools: [
            {
              functionDeclarations: tools,
            },
          ],
        },
      });
    } catch (error) {
      this.handleGeminiError(error);
    }
  }

  async generateAfterToolCall(
    prompt: string,
    previousResponse: GenerateContentResponse,
    functionCall: FunctionCall,
    toolResult: unknown,
  ): Promise<string> {
    try {
      const modelContent = previousResponse.candidates?.[0]?.content;

      if (!modelContent) {
        throw new Error('Gemini response does not contain model content');
      }

      const response = await this.client.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },

          // IMPORTANT:
          // reuse Gemini's original content exactly as returned
          modelContent,

          {
            role: 'user',
            parts: [
              {
                functionResponse: {
                  name: functionCall.name,
                  id: functionCall.id,
                  response: {
                    result: toolResult,
                  },
                },
              },
            ],
          },
        ],
        config: {
          systemInstruction: this.systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });
      if (!response.text?.trim()) {
        throw new AiEmptyResponseException();
      }

      return response.text;
    } catch (error) {
      this.handleGeminiError(error);
    }
  }

  private handleGeminiError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const status =
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof error.status === 'number'
        ? error.status
        : undefined;

    if (status === 429) {
      throw new TooManyRequestsException(
        'AI request limit reached. Please try again later.',
      );
    }

    throw new ServiceUnavailableException(
      'AI service is temporarily unavailable.',
    );
  }
}
