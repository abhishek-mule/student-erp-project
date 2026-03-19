import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Set trust proxy config for Render/Vercel load balancers to retrieve accurate client IPs for Rate Limiting.
  app.set('trust proxy', 1);

  // Enable CORS
  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT || 3001);
  console.log(`Backend API running on port ${process.env.PORT || 3001}`);
}
bootstrap();
