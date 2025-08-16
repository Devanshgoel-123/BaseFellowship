import { db } from "../db/db.js";
import { creators, hits, users } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";

/**
 * Register a new creator
 * @param userId
 * @param displayName
 * @param coinAddress
 * @param pfp
 * @returns
 */
export const registerCreator = async (
  creatorAddress: string,
  displayName: string,
  coinAddress: string,
  pfp: string
): Promise<boolean> => {
  try {
    const lowerCaseCreatorWalletAddress = creatorAddress.toLowerCase();
    const creator = await db
      .insert(creators)
      .values({
        creatorAddress: lowerCaseCreatorWalletAddress,
        displayName,
        coinAddress,
        pfp,
      })
      .returning();
    return true;
  } catch (error) {
    console.log("Error registering creator", error);
    return false;
  }
};

/**
 * Get the creator profile for a given creator id
 * @param creatorId
 * @returns
 */

export const getCreatorProfile = async (creatorAddress: string) => {
  try {
    const lowerCaseWalletAddress = creatorAddress.toLowerCase();
    const creator = await db
      .select()
      .from(creators)
      .where(eq(creators.creatorAddress, lowerCaseWalletAddress));
    return creator[0];
  } catch (error) {
    console.log("Error getting creator profile", error);
    return null;
  }
};

/**
 * Get the leaderboard for the creators
 * @returns
 */

export const getCreatorsLeaderboard = async () => {
  try {
    const leaderboard = await db
      .select()
      .from(creators)
      .orderBy(desc(creators.totalHits));
    return leaderboard;
  } catch (error) {
    console.log("Error getting creator leaderboard", error);
    return [];
  }
};

/**
 *
 * @param creatorAddress
 * @returns
 */
export const getTopFans = async (creatorAddress: string) => {
  try {
    const lowerCaseWalletAddress = creatorAddress.toLowerCase();
    const result = await db
      .select({
        userAddress: hits.userAddress,
        username: users.username,
        totalPoints: sql<number>`SUM(COALESCE(CAST(${hits.hitScores} ->> ${lowerCaseWalletAddress} AS INTEGER), 0))`,
      })
      .from(hits)
      .innerJoin(users, eq(hits.userAddress, users.walletAddress))
      .where(sql`${hits.hitScores} ? ${lowerCaseWalletAddress}`)
      .groupBy(hits.userAddress, users.username, users.walletAddress)
      .orderBy(
        desc(
          sql`SUM(COALESCE(CAST(${hits.hitScores} ->> ${lowerCaseWalletAddress} AS INTEGER), 0))`
        )
      )
      .limit(20);

    return result;
  } catch (err) {
    console.error("Error getting top fans", err);
    return [];
  }
};
