import { db } from "../db/db.js";
import { creators,hits, users } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";


/**
 * Register a new creator
 * @param userId 
 * @param displayName 
 * @param coinAddress 
 * @param pfp 
 * @returns 
 */
export const registerCreator=async (userId: number, displayName: string, coinAddress: string, pfp: string):Promise<boolean>=>{
    try{
        const creator=await db.insert(creators).values({
            creatorId:userId,
            displayName,
            coinAddress,
            pfp
        }).returning();
        return true;
    }catch(error) {
        console.log('Error registering creator', error);
        return false;
    }
}       

/**
 * Get the creator profile for a given creator id
 * @param creatorId 
 * @returns 
 */

export const getCreatorProfile=async (creatorId: number)=>{
    try{
        const creator=await db.select().from(creators).where(eq(creators.id, creatorId));
        return creator[0];
    }catch(error){
        console.log('Error getting creator profile', error);
        return null;
    }
}

/**
 * Get the leaderboard for the creators
 * @returns 
 */

export const getCreatorsLeaderboard=async ()=>{
    try{
        const leaderboard=await db.select().from(creators).orderBy(desc(creators.totalHits));
        return leaderboard;
    }catch(error){
        console.log('Error getting creator leaderboard', error);
        return [];
    }
}

export const getTopFans=async (creatorId: number)=>{
    try{
        const result = await db
        .select({
          fanId: hits.fanId,
          username: users.username,
          walletAddress: users.walletAddress,
          totalHits: sql<number>`COUNT(${hits.id})`,
        })
        .from(hits)
        .innerJoin(users, eq(hits.fanId, users.id))
        .where(eq(hits.creatorId, creatorId))
        .groupBy(hits.fanId, users.username, users.walletAddress)
        .orderBy(desc(sql`COUNT(${hits.id})`))
        .limit(10);
    
      return result;
    }catch(err){
        console.log('Error getting top fans', err);
        return [];
    }
}
