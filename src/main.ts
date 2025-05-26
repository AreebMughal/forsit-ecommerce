import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { HttpExceptionFilter } from './utils/interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Sada khata - API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();
  
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.info(`Server is running on http://localhost:${port}`);
}

bootstrap();
