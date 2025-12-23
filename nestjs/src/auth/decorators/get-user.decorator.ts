import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '../../types/prisma.types';

export const GetUser = createParamDecorator(
  (
    data: keyof User | undefined,
    ctx: ExecutionContext,
  ): User | User[keyof User] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    return data ? user[data] : user;
  },
);
