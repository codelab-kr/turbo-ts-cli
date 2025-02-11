import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { DRIZZLE } from '@packages/database';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { UsersService } from './users/users.service';
import { ConfigService } from '@nestjs/config';
import { getEnv } from './utils/config.util';
import bcrypt from 'bcrypt';
import type { CreateUserDto, NewUser, User } from '@packages/database';
import * as schema from '@packages/database';
const { users } = schema;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
    @InjectRedis() private readonly redis: Redis,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  async getUserById(id: string) {
    return await this.usersService.getUser(id);
  }

  /** 🔹 OAuth 로그인 처리 (Google, GitHub) */
  async validateOAuthLogin(userData: NewUser) {
    const userArray = await this.db
      .select()
      .from(users)
      .where(and(eq(users.provider, userData.provider), eq(users.provider_id, userData.provider_id!)))
      .limit(1);

    const user = userArray.length > 0 ? userArray[0] : null;

    if (!user) {
      const [newUser] = await this.db
        .insert(users)
        .values({ ...userData })
        .returning();
      const tokens = this.generateTokens(newUser);
      return { tokens, user: newUser };
    }
    const tokens = this.generateTokens(user);
    return { tokens, user };
  }

  /** 🔹 이메일 회원가입 */
  async register(userData: CreateUserDto) {
    const { email, password } = userData;
    if (!email || !password) throw new UnauthorizedException('Email and password are required');

    const existingUser = await this.usersService.getUserByEmail(email);
    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      provider: 'email',
      email: userData.email,
      password: hashedPassword,
    });

    const tokens = this.generateTokens(user!);
    return { tokens, user };
  }

  /** 🔹 이메일 로그인 */
  async login(email: string, password: string) {
    if (!email || !password) throw new UnauthorizedException('Email and password are required');

    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    const tokens = this.generateTokens(user);
    return { tokens, user };
  }

  /** 🔹 로그아웃 (Refresh Token 삭제) */
  async logout(id: string) {
    return Boolean(await this.redis.del(`refreshToken:${id}`));
  }

  /** 🔹 JWT & Refresh Token 발급 */
  private async generateTokens(user: Omit<User, 'password'>) {
    const payload = {
      id: user.id,
      provider: user.provider,
      provider_id: user.provider_id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: getEnv(this.configService, 'JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: getEnv(this.configService, 'REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }
    );

    // 🔹 Refresh Token을 Redis에 저장 (7일)
    await this.redis.set(`refreshToken:${user.id}`, refreshToken, 'EX', 604800);

    return { accessToken, refreshToken };
  }

  /** 🔹 Refresh Token 갱신 */
  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: getEnv(this.configService, 'REFRESH_TOKEN_SECRET'),
      });

      const storedToken = await this.redis.get(`refreshToken:${decoded.sub}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token expired or invalid');
      }

      const user = await this.usersService.getUser(decoded.sub);
      if (!user) throw new UnauthorizedException('Invalid refresh token');

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
}
