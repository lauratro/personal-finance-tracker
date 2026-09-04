import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FunctionDeclaration,
  GoogleGenAI,
  GenerateContentResponse,
  FunctionCall,
} from '@google/genai';

@Injectable()
export class AiService {
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');

    this.model = this.configService.getOrThrow<string>('GEMINI_MODEL');

    this.client = new GoogleGenAI({
      apiKey,
    });
  }

  // Normal LLM call: prompt → text response
  async generateResponse(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
    });

    return response.text ?? '';
  }

  // Agent call: prompt + available tools → Gemini decision
  async generateWithTools(prompt: string, tools: FunctionDeclaration[]) {
    return this.client.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        tools: [
          {
            functionDeclarations: tools,
          },
        ],
      },
    });
  }

  async generateAfterToolCall(
    prompt: string,
    previousResponse: GenerateContentResponse,
    functionCall: FunctionCall,
    toolResult: unknown,
  ): Promise<string> {
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
    });

    return response.text ?? '';
  }
}
