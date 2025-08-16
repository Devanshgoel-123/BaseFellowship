import type { Request, Response } from "express";
import {
  getUserProfile,
  registerUser,
  updateGameHits,
  getLeaderboard,
  getUserRewards,
  getUserHits,
} from "../services/userService.js";
import { getProfileCoins } from "@zoralabs/coins-sdk";
import { getProfileBalances } from "@zoralabs/coins-sdk";
import { client } from "../index.js";

export const userFarcasterData = async (
  walletAddress: string
): Promise<userDetails> => {
  try {
    const userDetails = await client.fetchBulkUsersByEthOrSolAddress({
      addresses: [walletAddress],
    });
    if (
      !userDetails ||
      !userDetails[walletAddress.toLowerCase()] ||
      userDetails[walletAddress.toLowerCase()].length === 0
    ) {
      return {
        name: "",
        pfp: "",
      };
    }
    const userName = userDetails[walletAddress.toLowerCase()][0];
    return {
      name: userName.display_name || "",
      pfp: userName.pfp_url || "",
    };
  } catch (err) {
    console.log("The error is", err);
    return {
      name: "",
      pfp: "",
    };
  }
};

interface userDetails {
  name: string;
  pfp: string;
}

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }
    const userDetails = await userFarcasterData(walletAddress);
    let name: string = "";
    let pfp: string = "";
    if (userDetails.name !== "" && userDetails.pfp !== "") {
      name = userDetails.name;
      pfp = userDetails.pfp;
    }
    const user = await registerUser(name, walletAddress, pfp);
    if (user) {
      res.status(200).json({ message: "User registered successfully" });
    } else {
      res.status(400).json({ message: "Failed to register user" });
    }
  } catch (error) {
    console.log("Error registering user", error);
  }
};

export const GetUserProfile = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.query;
    console.log(walletAddress);
    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }
    const user = await getUserProfile(walletAddress as string);
    if (user !== null) {
      res.status(200).json({
        user: user,
      });
    } else {
      const userDetails = await userFarcasterData(walletAddress as string);
      let name: string = "";
      let pfp: string = "";
      if (userDetails.name !== "" && userDetails.pfp !== "") {
        name = userDetails.name;
        pfp = userDetails.pfp;
      }
      const user = await registerUser(name, walletAddress as string, pfp);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  } catch (error) {
    console.log("Error getting user profile", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateUserGameHits = async (req: Request, res: Response) => {
  try {
    const { userAddress, hitScores, normalPoints } = req.body;
    console.log(req.body);
    const user = await updateGameHits(userAddress, hitScores, normalPoints);
    if (user) {
      res.status(200).json({ message: "User game hits updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update user game hits" });
    }
  } catch (error) {
    console.log("Error updating user game hits", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetUserLeaderBoard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await getLeaderboard();
    if (leaderboard) {
      res.status(200).json({ leaderboard });
    } else {
      res.status(404).json({ message: "No leaderboard found" });
    }
  } catch (err) {
    console.log("Error getting user leaderboard", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetUserRewards = async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.query;
    if (!userAddress) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const rewards = await getUserRewards(userAddress as string);
    if (rewards) {
      res.status(200).json({ rewards });
    } else {
      res.status(404).json({ message: "No rewards found" });
    }
  } catch (err) {
    console.log("Error getting user rewards", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetUserHits = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const hits = await getUserHits(walletAddress as string);
    if (hits) {
      res.status(200).json({ hits });
    } else {
      res.status(404).json({ message: "No hits found" });
    }
  } catch (err) {
    console.log("Error getting user hits", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetWalletDetails = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res
        .status(400)
        .json({ message: "User wallet Address is required" });
    }
    const response = await getProfileBalances({
      identifier: walletAddress as string,
      count: 20,
      after: undefined,
    });
    const profile: any = response.data?.profile;
    console.log(`Found ${profile.coinBalances?.length || 0} coin balances`);

    return res.status(200).json({
      data: profile.coinBalances,
    });
  } catch (err) {
    return res.status(400).json({
      data: "Error fetching token balances",
    });
  }
};
