import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthCommonService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // 가드 없이 개별 검증: API Gateway, WebSocket, 별도 인증 로직에서 사용 가능
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        ignoreExpiration: false,
      });
    } catch {
      return null;
    }
  }
}
