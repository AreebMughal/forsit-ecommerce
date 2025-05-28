import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { HttpExceptionFilter } from './utils/interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
   const config = new DocumentBuilder()
    .setTitle('E-commerce Admin Dashboard API')
    .setDescription('API for managing e-commerce sales, inventory, and analytics')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();
  
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.info(`Server is running on http://localhost:${port}`);
  console.log('Swagger documentation: http://localhost:3000/api');
}

bootstrap();
