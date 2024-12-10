import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  const config = new DocumentBuilder()
  .setTitle('Panels services')
  .setDescription('The panels API description')
  .setVersion('1.0')
  .addTag('panels')
  .build();
app.enableCors(); // Habilita CORS para todas las rutas
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
  await app.listen(3000);
  
}
bootstrap();
