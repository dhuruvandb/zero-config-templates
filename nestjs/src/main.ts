import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';

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

  // Enable cookie parser
  app.use(cookieParser());

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
