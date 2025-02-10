import { Controller, Get, Query, UnauthorizedException,  UseGuards, Req } from '@nestjs/common';
import { AuthCommonService, JwtAuthGuard } from '@packages/auth-common';

interface CustomRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}

@Controller()
export class AppController {
  constructor(
      private readonly authCommonService: AuthCommonService
  ) {}

  @Get('auth/profile')
  @UseGuards(JwtAuthGuard)
  // getProfile(@Request() req: any) {
  getProtectedResource(@Req() req: CustomRequest) {
    return { message: 'This is a protected route', user: req.user };
  }
  
  @Get('auth/manual')
  async verifyManually(@Query('token') token: string) {
    const user = await this.authCommonService.verifyToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return { message: 'Token is valid', user };
  }
}
