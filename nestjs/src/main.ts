import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, Logger } from '@nestjs/common';
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
import { auth } from './lib/auth.js';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS with credentials
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:4200',
    ],
    credentials: true,
  });

  // Mount Better Auth handler BEFORE NestJS global pipes
  // Note: path-to-regexp v8+ doesn't support wildcard patterns, so we mount without path
  const authHandler = toNodeHandler(auth);
  app.use((req: any, res: any, next: any) => {
    if (req.path.startsWith('/api/auth')) {
      return authHandler(req, res);
    }
    next();
  });

  // Auth middleware — attaches userId to req for all /api/items routes
  app.use('/api/items', async (req: any, res: any, next: any) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    (req as any).userId = session.user.id;
    next();
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
