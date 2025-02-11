import { ConfigService } from '@nestjs/config';

export const getEnv = (configService: ConfigService, envName: string): string => {
  const value = configService.get<string>(envName);
  if (!value) {
    throw new Error(`Missing environment variable: ${envName}`);
  }
  return value;
};