import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';

// Validate required environment variables
function validateEnvironment(): void {
  const required = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
    console.error(
      'Generate secrets with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
    );
    process.exit(1);
  }
}

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  
  // Validate environment variables before starting
  validateEnvironment();
  
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
