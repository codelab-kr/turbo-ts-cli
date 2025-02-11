import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import cookieParser from 'cookie-parser';
import express from 'express';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  // ✅ .env에서 FRONTEND_URL 불러오기
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

  // ✅ CORS 설정 추가
  app.enableCors({
    origin: frontendUrl, // Next 프론트엔드 URL 허용
    credentials: true, // 쿠키, 헤더 포함 가능하도록 설정
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드
    allowedHeaders: 'Content-Type, Authorization', // 허용할 헤더
  });
  app.use(cookieParser());
  app.use(express.json()); // ✅ JSON 바디를 올바르게 파싱하도록 보장
  app.use(express.urlencoded({ extended: true }));

  // ✅ 전역 예외 필터 추가 (401 반환 명확히 하기)
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(4000);
  console.log('NestJS app is running on http://localhost:4000');
}
bootstrap();
