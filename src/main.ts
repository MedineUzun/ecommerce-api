import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Global Filters & Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Wibesoft E-Commerce API')
    .setDescription('Backend API for e-commerce platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Products')
    .addTag('Cart')
    .addTag('Orders')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  // Start Server
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is available at: http://localhost:${port}/api/docs`);
}
bootstrap();
