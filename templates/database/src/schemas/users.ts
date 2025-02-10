import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { z } from 'zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
});

export const profileInfo = pgTable('profileInfo', {
  id: serial('id').primaryKey(),
  metadata: jsonb('metadata'),
  userId: integer('user_id').references(() => users.id),
});
