import { Global, Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
// import * as schema from './schemas';
// import pg from 'pg'; // for esm
import { db } from './db';

export const DRIZZLE = Symbol('drizzle-connection');

@Global()
@Module({
  // imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      useValue: db,
      // inject: [ConfigService],
      // useFactory: (configService: ConfigService) => {
      //   const pool = new pg.Pool({
      //     connectionString: configService.getOrThrow('DATABASE_URL'),
      //   });
      //   return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      // },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
