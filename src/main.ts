import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  app.enableCors();

  const config = new DocumentBuilder()
  .setTitle("Sport - Booking")
  .setDescription("API to book sport fields")
  .setVersion("1.0")
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = Number(process.env.PORT) ?? 3000;
  await app.listen(port, () => console.log('working on port ' + port));
}
bootstrap();
