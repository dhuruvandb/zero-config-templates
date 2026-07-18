import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth.js';

export const Session = createParamDecorator(
    async (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(request.headers),
        });
        if (!session) {
            throw new UnauthorizedException();
        }
        return session;
    },
);
