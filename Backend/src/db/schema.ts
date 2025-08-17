import {
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  walletAddress: varchar("wallet_address", { length: 100 }).notNull().unique(),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  userPfp: varchar("user_pfp", { length: 150 }).notNull().unique(),
});

/**
 * Keeps record of the creator details
 */

export const creators = pgTable("creators", {
  id: serial("id").primaryKey(),
  creatorAddress: varchar("creator_address").notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  totalHits: integer("total_hits").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  coinAddress: varchar("coin_address", { length: 100 }).notNull(),
  pfp: varchar("creator_pfp", { length: 100 }).notNull(),
  message: varchar("message", { length: 100 }).notNull().default(""),
});

/**
 * Rewards table keeps track of the fans who have been rewarded by the creators
 * for their hits.
 */
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id")
    .references(() => creators.id)
    .notNull(),
  userAddress: varchar("user_address")
    .references(() => users.walletAddress)
    .notNull(),
  amount: integer("amount").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // e.g., "hit_reward", "milestone_bonus"
  claimed: boolean("claimed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Track the hits for various creators and fans inside a game
 */
export const hits = pgTable("hits", {
  id: serial("id").primaryKey(),
  userAddress: varchar("user_address")
    .references(() => users.walletAddress)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  hitScores: jsonb("hit_scores").$type<Record<string, number>>().default({}),
  normalPoints: integer("normal_points").notNull(),
});
