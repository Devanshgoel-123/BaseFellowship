import { db } from "../db/db.js";
import { users, hits, rewards } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";

/**
 * Register a new user
 * @param username
 * @param walletAddress
 * @returns
 */
export const registerUser = async (
  username: string,
  walletAddress: string,
  pfp: string
): Promise<boolean> => {
  try {
    console.log("The user registery is called");
    const lowerCaseWalletAddress = walletAddress.toLowerCase();
    const user = await db
      .insert(users)
      .values({
        username,
        walletAddress: lowerCaseWalletAddress,
        userPfp: pfp,
      })
      .returning();
    return true;
  } catch (error) {
    console.log("Error registering user", error);
    return false;
  }
};

/**
 * Get the user profile for a given wallet address
 * @param walletAddress
 * @returns
 */
export const getUserProfile = async (walletAddress: string) => {
  try {
    const lowerCaseWalletAddress = walletAddress.toLowerCase();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, lowerCaseWalletAddress));
    if (user.length > 0) {
      return user[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error getting user profile", error);
    return null;
  }
};

/**
 * Update the hit history for a user
 * @param creatorId
 * @param fanId
 * @param gameId
 * @param hitScores
 * @returns
 */
export const updateGameHits = async (
  userAddress: string,
  hitScores: Record<number, number>,
  normalPoints: number
) => {
  try {
    const lowerCaseWalletAddress = userAddress.toLowerCase();
    const userPoints = await db
      .update(users)
      .set({
        points: sql`${users.points} + ${normalPoints}`,
      })
      .where(eq(users.walletAddress, lowerCaseWalletAddress));
    const hitsEntry = await db
      .insert(hits)
      .values({
        userAddress: lowerCaseWalletAddress,
        hitScores,
        normalPoints,
      })
      .returning();
    console.log("Hits entry", hitsEntry);
    return true;
  } catch (error) {
    console.log("Error getting user profile", error);
    return false;
  }
};

/**
 * Get the hit history for a user
 * @param userId
 * @returns
 */
export const getUserHits = async (userAddress: string) => {
  try {
    const lowerCaseWalletAddress = userAddress.toLowerCase();
    const hitHistory = await db
      .select()
      .from(hits)
      .where(eq(hits.userAddress, lowerCaseWalletAddress));
    return hitHistory;
  } catch (error) {
    console.log("Error getting user hits", error);
    return [];
  }
};

/**
 * Get the rewards history for a user
 * @param userId
 * @returns
 */
export const getUserRewards = async (userAddress: string) => {
  try {
    const lowerCaseWalletAddress = userAddress.toLowerCase();
    const rewardsHistory = await db
      .select()
      .from(rewards)
      .where(eq(rewards.userAddress, lowerCaseWalletAddress));
    return rewardsHistory;
  } catch (error) {
    console.log("Error getting user rewards", error);
    return [];
  }
};

/**
 * Get the leaderboard for the users
 * @returns
 */
export const getLeaderboard = async () => {
  try {
    const leaderboard = await db
      .select()
      .from(users)
      .orderBy(desc(users.points));
    return leaderboard;
  } catch (error) {
    console.log("Error getting leaderboard", error);
    return [];
  }
};
