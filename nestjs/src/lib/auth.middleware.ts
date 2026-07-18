import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth.js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, _res: Response, next: NextFunction) {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if (!session) {
            throw new UnauthorizedException();
        }
        // Attach the user session to the request for downstream handlers
        (req as any).session = session;
        next();
    }
}
