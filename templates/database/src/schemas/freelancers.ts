import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const freelancers = pgTable("freelancers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  email: text("email").unique().notNull(),
  profileImage: text("profile_image"),
  skills: text("skills").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});