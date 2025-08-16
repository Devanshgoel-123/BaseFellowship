
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()
const BASE_USER_URL =process.env.BACKEND_URL || "http://localhost:8080/api/v1";

/**
 * Register a new user
 * @param username - The username of the user
 * @param walletAddress - The wallet address of the user
 * @returns The user data
 */
export const registerUser = async ({
  username,
  walletAddress
}:{
    username:string,
    walletAddress:string
})=>{
    try{
        const response = await axios.post(`${BASE_USER_URL}/users/register`,{
                username,
                walletAddress
        })
        return response.data
    }catch(error){
        console.log("Error registering user",error)
    }
}

/**
 * Get user profile
 * @param walletAddress - The wallet address of the user
 * @returns The user data
 */
export const getUserProfile = async ({
    walletAddress
}:{
    walletAddress:string
})=>{
    try{
        if(!walletAddress){
            throw new Error("Wallet address is required")
        }
        const response = await axios.get(`${BASE_USER_URL}/users/profile`,{
            params:{
                walletAddress   
            }
        })
        return response.data
    }catch(error){
        console.log("Error fetching user profile",error)
    }
}

/**
 * Update user game history
 * @param gameId - The id of the game
 * @param hitScores - The scores of the hits
 * @param userAddress - The wallet address of the user
 * @param normalPoints - The normal points of the user
 * @returns The user data
 */
export const updateUserGameHistory = async ({
    hitScores,
    userAddress,
    normalPoints
}:{
    userAddress:string,
    hitScores:Record<string, number>,
    normalPoints:number
})=>{
    try{
        if(!userAddress){
            throw new Error("Wallet address is required")
        }
        let userAddressNew="0x36ca9F30D48acD5E1FA10eD995783EdD8741eb3f"
        console.log("The update user history",hitScores,userAddressNew,normalPoints)
        const response = await axios.post(`${BASE_USER_URL}/users/updateHits`,{
                hitScores,
                userAddress:userAddressNew,
                normalPoints
        })
        return response.data
    }catch(error){
        console.log("Error updating user game history",error)
    }
}


/**
 * Get leaderboard
 * @returns The leaderboard data
 */
export const getLeaderBoard = async ()=>{
    try{
        const response = await axios.get(`${BASE_USER_URL}/user/leaderboard`)
        return response.data
    }catch(error){
        console.log("Error fetching leaderboard",error)
    }
}

/**
 * Get user rewards
 * @param userAddress - The wallet address of the user
 * @returns The user rewards data
 */
export const getUserRewards = async ({
    userAddress
}:{
    userAddress:string
})=>{
    try{
        const response = await axios.get(`${BASE_USER_URL}/user/rewards`,{
            params:{
                userAddress
            }
        })
        return response.data
}catch(error){
    console.log("Error fetching user rewards",error)
}
}   
