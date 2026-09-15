import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequestUser } from '../types/authenticated-request-user.type';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedRequestUser;
    }>();

    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authenticated user is missing');
    }

    return userId;
  },
);
