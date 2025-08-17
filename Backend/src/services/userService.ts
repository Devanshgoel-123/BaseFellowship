import { db } from "../db/db.js";
import { users, hits, rewards, creators } from "../db/schema.js";
import { eq, desc, sql, gte, and, gt } from "drizzle-orm";
import { inArray } from "drizzle-orm";
import { ethers} from "ethers";
import { providers } from "ethers";
import { customPoolABI } from "../ABI/customPool.js";
import { config } from "dotenv";
config();
const REWARD_MULTIPLIER = 10;
export const CONTRACT_ADDRESS = "0x8B5e027068b9d819934c82cC48AE281706428fE0"
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
  hitScores: Record<string, number>,
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
    for (const [coinAddress, score] of Object.entries(hitScores)) {
      const lowerCaseCreatorAddress = coinAddress.toLowerCase();
      const reward = await db
        .insert(rewards)
        .values({
          coinAddress: lowerCaseCreatorAddress,
          userAddress: lowerCaseWalletAddress,
          amount: REWARD_MULTIPLIER * score,
        }).returning();
      console.log("Reward", reward);
    }
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
export const getLeaderboard = async (duration: string) => {
  try {
    let whereCondition;
    if (duration === "weekly") {
      whereCondition = gte(users.createdAt, sql`NOW() - INTERVAL '7 days'`);
    } else if (duration === "allTime") {
      whereCondition = sql`TRUE`;
    }
    const leaderboard = await db
      .select()
      .from(users)
      .where(whereCondition ?? sql`TRUE`)
      .orderBy(desc(users.points));
    return leaderboard;
  } catch (error) {
    console.log("Error getting leaderboard", error);
    return [];
  }
};


/**
 * Calculate the pending rewards for the users
 * @returns
 */
export const CalculatePendingRewards = async () => {
  try {
    const result = await db
      .select({
        creatorId: creators.id, // from creators table
        coinAddress: rewards.coinAddress,
        userAddress: rewards.userAddress,
        totalAmount: sql`SUM(${rewards.amount})`.as("total_amount"),
        ids: sql`ARRAY_AGG(${rewards.id})`.as("ids"),
      })
      .from(rewards)
      .innerJoin(creators, sql`${String(rewards.coinAddress).toLowerCase()} = ${String(creators.coinAddress).toLowerCase()}`)
      .where(
        sql`${rewards.claimed} = false`
      )
      .groupBy(creators.id, rewards.coinAddress, rewards.userAddress);

    return result;
  } catch (error) {
    console.log("Error getting pending rewards", error);
    return [];
  }
};

const Config = {
  creatorId: 1, // Update with actual creatorId
  tokenDecimals: 1, // Adjust if token uses different decimals
  maxRetries: 3, // Max retries for failed transactions
};

// Cron job to distribute rewards
export const distributeRewardsCron = async () => {
  console.log('Starting reward distribution cron job at', new Date().toISOString());

  try {
    const pendingRewards = await CalculatePendingRewards();
    console.log("Pending rewards", pendingRewards);
    if (!pendingRewards.length) {
      console.log('No pending rewards to distribute.');
      return;
    }
    const ids = pendingRewards.map(reward => reward.ids);
    // Fix: Aggregate rewards by userAddress and coinAddress
    const aggregatedRewards = pendingRewards.reduce((acc: Record<string, {
      coinAddress: string;
      userAddress: string;
      totalAmount: number;
      creatorId: number;
    }>, reward) => {
      
      const key = `${reward.userAddress}-${reward.coinAddress}`;
      if (!acc[key]) {
        acc[key] = {
          coinAddress: reward.coinAddress,
          userAddress: reward.userAddress,
          totalAmount: 0,
          creatorId: reward.creatorId,
        };
      }
      acc[key].totalAmount +=REWARD_MULTIPLIER * Number(reward.totalAmount);
      // Fix: Properly handle the ids array - reward.ids is already an array
      return acc;
    }, {});

    const uniqueRewards = Object.values(aggregatedRewards);
    const provider = new ethers.providers.JsonRpcProvider("https://base-sepolia.drpc.org");
    const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
    console.log("The wallet is", wallet);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, customPoolABI, wallet);
    console.log("The unique rewards are", uniqueRewards);
    for (const reward of uniqueRewards) {
      const { coinAddress, userAddress, totalAmount } = reward;
      let attempt = 0;
      let success = false;
      console.log("Reward", reward);
      
      while (attempt < Config.maxRetries && !success) {
        try {
          const amount = ethers.utils.parseUnits(totalAmount.toString(), Config.tokenDecimals);
          console.log(`Attempt ${attempt + 1}: Distributing ${totalAmount} to ${userAddress} for creatorId ${reward.creatorId}`);

          const tx = await contract.distributeReward(reward.creatorId, userAddress, amount);
          console.log(`Transaction sent: ${tx.hash}`);

          // Wait for transaction confirmation
          await tx.wait();
          console.log(`Transaction confirmed: ${tx.hash}`);

          // Fix: Mark specific reward IDs as claimed with proper SQL syntax
          const idsArray = ids.map(id => Number(id)).filter(id => !isNaN(id));
          console.log("The ids array is", idsArray);
          if (idsArray.length > 0) {
            await db
            .update(rewards)
            .set({ claimed: true })
            .where(inArray(rewards.id, idsArray));
            console.log(`Marked rewards with IDs ${idsArray.join(', ')} as claimed for user ${userAddress} and coin ${coinAddress}`);
          }

          success = true;
        } catch (error) {
          attempt++;
          console.error(`Attempt ${attempt} failed for ${userAddress} (coin: ${coinAddress}):`, error);
          if (attempt < Config.maxRetries) {
            console.log(`Retrying... (${attempt}/${Config.maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          } else {
            console.error(`Max retries reached for ${userAddress} (coin: ${coinAddress}). Skipping.`);
          }
        }
      }
    }

    console.log('Reward distribution cron job completed successfully.');
  } catch (error) {
    console.error('Error in reward distribution cron job:', error);
  }
};