import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error if extra properties are sent
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter()); // Register the global exception filter
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
