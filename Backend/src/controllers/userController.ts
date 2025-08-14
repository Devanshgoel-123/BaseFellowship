import type { Request, Response } from "express";
import { getUserProfile, registerUser, updateGameHits, getLeaderboard, getUserRewards, getUserHits } from "../services/userService.js";

export const RegisterUser=async (req: Request, res: Response) => {
    try{
        const {username, walletAddress}=req.body;
        const user=await registerUser(username, walletAddress);
        if(user){
            res.status(200).json({message: 'User registered successfully'});
        }else{
            res.status(400).json({message: 'Failed to register user'});
        }
    }catch(error){
        console.log('Error registering user', error)
    }
}

export const GetUserProfile=async (req: Request, res: Response) => {
    try{
        const {walletAddress}=req.params;
        if(!walletAddress){
            return res.status(400).json({message: 'Wallet address is required'});
        }
        const user=await getUserProfile(walletAddress)
        if(user){
            res.status(200).json({user});
        }else{
            res.status(404).json({message: 'User not found'});
        }
    }catch(error){
        console.log('Error getting user profile', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const UpdateUserGameHits=async (req: Request, res: Response) => {
    try{
        const {fanId,creatorId, gameId, hitScores}=req.body;
        const user=await updateGameHits(creatorId, fanId, gameId, hitScores);
        if(user){
            res.status(200).json({message: 'User game hits updated successfully'});
        }else{
            res.status(400).json({message: 'Failed to update user game hits'});
        }
    }catch(error){
        console.log('Error updating user game hits', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const GetUserLeaderBoard=async (req: Request, res: Response) => {
    try{
        const leaderboard=await getLeaderboard();
        if(leaderboard){
            res.status(200).json({leaderboard});
        }else{
            res.status(404).json({message: 'No leaderboard found'});
        }
    }catch(err){
        console.log('Error getting user leaderboard', err);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const GetUserRewards=async (req: Request, res: Response) => {
    try{
        const {userId}=req.params;
        if(!userId){
            return res.status(400).json({message: 'User ID is required'});
        }
        const rewards=await getUserRewards(Number(userId));
        if(rewards){
            res.status(200).json({rewards});
        }else{
            res.status(404).json({message: 'No rewards found'});
        }
    }catch(err){
        console.log('Error getting user rewards', err);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const GetUserHits=async (req: Request, res: Response) => {
    try{
        const {userId}=req.params;
        if(!userId){
            return res.status(400).json({message: 'User ID is required'});
        }
        const hits=await getUserHits(Number(userId));
        if(hits){
            res.status(200).json({hits});
        }else{
            res.status(404).json({message: 'No hits found'});
        }
    }catch(err){
        console.log('Error getting user hits', err);
        res.status(500).json({message: 'Internal server error'});
    }
}