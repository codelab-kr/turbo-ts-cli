import { Controller, Post, UseGuards, HttpCode, Body, Res, Req, UnauthorizedException, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { JwtAuthGuard } from '@packages/auth-common';
import { ZodValidationPipe } from 'nestjs-zod';
import { createUserSchema } from '@packages/database';
import { getEnv } from './utils/config.util';
import express from 'express'; // for esm
import type { CreateUserDto, NewUser, User } from '@packages/database';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  private setRefreshToken(res: express.Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // 개발 환경에서만 false (운영환경(HTTPS)에서는 true)
      sameSite: 'lax', // 크로스 사이트 요청 허용  (운영환경에서는 'strict' 적용)
    });
  }

  private async redirectWithTokens(
    res: express.Response,
    tokens: { accessToken: string; refreshToken: string },
    user: User
  ) {
    this.setRefreshToken(res, tokens.refreshToken);
    const userString = encodeURIComponent(JSON.stringify(user));
    const redirectUrl = `${getEnv(this.configService, 'FRONTEND_URL')}/auth/callback?token=${tokens.accessToken}&user=${userString}`;
    return res.redirect(redirectUrl);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return { message: 'Google authentication' };
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubLogin() {
    return { message: 'GitHub authentication' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req: { user: NewUser }, @Res() res: express.Response) {
    const { tokens, user } = await this.authService.validateOAuthLogin(req.user);
    return this.redirectWithTokens(res, await tokens, user);
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubLoginCallback(@Req() req: { user: NewUser }, @Res() res: express.Response) {
    const { tokens, user } = await this.authService.validateOAuthLogin(req.user);
    return this.redirectWithTokens(res, await tokens, user);
  }

  @Post('register')
  @HttpCode(201)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async register(@Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto): Promise<any> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }, @Res() res: express.Response) {
    const { tokens, user } = await this.authService.login(body.email, body.password);
    this.setRefreshToken(res, (await tokens).refreshToken);
    return reson({ token: (await tokens).accessToken, user });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(@Req() req: { user: { id: string } }, @Res() res: express.Response) {
    await this.authService.logout(req.user?.id);
    res.clearCookie('refreshToken');
    return reson({ message: 'Logged out successfully' });
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: express.Request, @Res() res: express.Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const newTokens = await this.authService.refreshTokens(refreshToken);
    this.setRefreshToken(res, newTokens.refreshToken);
    return reson({ token: newTokens.accessToken });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getProfile(@Req() req: { user: { id: string } }) {
    const user = await this.authService.getUserById(req.user?.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
