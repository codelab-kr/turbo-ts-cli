import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { freelancers } from './freelancers';

export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  freelancerId: integer('freelancer_id')
    .references(() => freelancers.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
