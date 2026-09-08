import { HttpException, HttpStatus } from '@nestjs/common';

export class AiEmptyResponseException extends HttpException {
  constructor() {
    super(
      {
        code: 'AI_EMPTY_RESPONSE',
        message: 'The AI assistant could not generate a response.',
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}
