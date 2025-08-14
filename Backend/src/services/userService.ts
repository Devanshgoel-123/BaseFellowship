import { db } from "../db/db.js";
import { users, hits, rewards } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

/**
 * Register a new user
 * @param username 
 * @param walletAddress 
 * @returns 
 */
export const registerUser=async (username: string, walletAddress: string):Promise<boolean>=>{
    try{
        const lowerCaseWalletAddress=walletAddress.toLowerCase();
        const user=await db.insert(users).values({
            username,
            walletAddress:lowerCaseWalletAddress
        }).returning();
        return true;
    }catch(error){
        console.log('Error registering user', error);
        return false;
    }
}

/**
 * Get the user profile for a given wallet address
 * @param walletAddress 
 * @returns 
 */
export const getUserProfile=async (walletAddress: string)=>{
    try{
        const user=await db.select().from(users).where(eq(users.walletAddress, walletAddress));
        return user[0];
    }catch(error){
        console.log('Error getting user profile', error)
    }
}


/**
 * Update the hit history for a user
 * @param creatorId 
 * @param fanId 
 * @param gameId 
 * @param hitScores 
 * @returns 
 */
export const updateGameHits=async (creatorId: number, fanId: number, gameId: string, hitScores: Record<number, number>)=>{
    try{
        const hitsEntry=await db.insert(hits).values({
            creatorId,
            fanId,
            gameId,
            hitScores
        }).returning();
        console.log('Hits entry', hitsEntry);
        return true;
    }catch(error) {
        console.log('Error getting user profile', error);
        return false;
    }
}   

/**
 * Get the hit history for a user
 * @param userId 
 * @returns 
 */
export const getUserHits=async (userId: number)=>{
    try{
        const hitHistory=await db.select().from(hits).where(eq(hits.fanId, userId));
        return hitHistory;
    }catch(error){
        console.log('Error getting user hits', error);
        return [];
    }
}   

/**
 * Get the rewards history for a user
 * @param userId 
 * @returns 
 */
export const getUserRewards=async (userId: number)=>{
    try{
        const rewardsHistory=await db.select().from(rewards).where(eq(rewards.fanId, userId));
        return rewardsHistory;
    }catch(error){
        console.log('Error getting user rewards', error);
        return [];
    }
}


/**
 * Get the leaderboard for the users
 * @returns 
 */
export const getLeaderboard=async ()=>{
    try{
        const leaderboard=await db.select().from(users).orderBy(desc(users.points));
        return leaderboard;
    }catch(error){
        console.log('Error getting leaderboard', error);
        return [];
    }
}
