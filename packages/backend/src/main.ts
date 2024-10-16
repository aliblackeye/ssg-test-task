import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ayarlarını güncelle
  app.enableCors({
    origin: 'http://localhost:3000', // İstemcinin bulunduğu URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Cookie'lerin gönderilmesine izin ver
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
