/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:4000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (error: any, user: any) => void) {
    const { id, username, emails, photos } = profile;
    const user = {
      provider: 'github',
      provider_id: id,
      email: emails?.[0]?.value || `${username}@github.com`,
      name: username || null,
      picture: photos?.[0]?.value || null,
    };
    done(null, user);
  }
}
