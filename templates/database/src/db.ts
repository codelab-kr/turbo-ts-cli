import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg'; // for esm
import * as schema from './schemas';

import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
