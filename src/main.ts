import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // global prefix
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidateInputPipe());

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Doc')
      .setDescription('API Requests')
      .setVersion('1.0')
      .addBearerAuth(
          {
            description: `Please enter token in following format:  <JWT>`,
            name: 'Authorization',
            bearerFormat: 'Bearer',
            scheme: 'Bearer',
            type: 'http',
            in: 'Header'
          })
      .build();



  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/documentation', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
