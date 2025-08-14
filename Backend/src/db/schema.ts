import { integer, pgTable, serial, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    walletAddress: varchar("wallet_address", { length: 100 }).notNull().unique(),
    points: integer("points").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    coinBalances: jsonb("coin_balances").$type<Record<string, number>>().default({})
});

/**
 * Keeps record of the creator details
 */

export const creators = pgTable("creators", {
    id: serial("id").primaryKey(),
    creatorId: integer("creator_id").references(() => users.id).notNull(),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    totalHits: integer("total_hits").default(0),
    tokenBalance: integer("rewards_balance").default(0), // tokens/points earned
    createdAt: timestamp("created_at").defaultNow(),
    coinAddress : varchar("coin_address", { length: 100 }).notNull(),
    pfp : varchar('creator_pfp', { length: 100 }).notNull(),
});

/**
 * Rewards table keeps track of the fans who have been rewarded by the creators
 * for their hits.
 */
export const rewards = pgTable("rewards", {
    id: serial("id").primaryKey(),
    creatorId: integer("creator_id").references(() => creators.id).notNull(),
    fanId: integer("fan_id").references(() => users.id),
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
    creatorId: integer("creator_id").references(() => creators.id).notNull(),
    fanId: integer("fan_id").references(() => users.id).notNull(),
    color: varchar("color", { length: 20 }).notNull(),
});