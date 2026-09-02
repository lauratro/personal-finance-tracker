import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly client: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');

    this.client = new GoogleGenAI({
      apiKey,
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return response.text ?? '';
  }
}
