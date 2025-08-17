import type { Request, Response } from "express";
import {
  getCreatorProfile,
  getCreatorsLeaderboard,
  getTopFans,
  registerCreator,
} from "../services/creatorService.js";
import { getRandomCreators } from "../services/creatorService.js";
/**
 * Register a new creator
 * @param req
 * @param res
 * @returns
 */
export const RegisterCreator = async (req: Request, res: Response) => {
  try {
    const { userId, displayName, coinAddress, pfp } = req.body;
    const creator = await registerCreator(
      userId,
      displayName,
      coinAddress,
      pfp
    );
    if (creator) {
      res.status(200).json({ message: "Creator registered successfully" });
    } else {
      res.status(400).json({ message: "Failed to register creator" });
    }
  } catch (error) {
    console.log("Error registering creator", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get the creator profile for a given creator id
 * @param req
 * @param res
 * @returns
 */

export const GetCreatorProfile = async (req: Request, res: Response) => {
  try {
    const { creatorAddress } = req.params;
    if (!creatorAddress) {
      return res.status(400).json({ message: "Creator ID is required" });
    }
    const creator = await getCreatorProfile(creatorAddress);
    if (creator) {
      res.status(200).json({ creator });
    } else {
      res.status(404).json({ message: "Creator not found" });
    }
  } catch (error) {
    console.log("Error getting creator profile", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get the leaderboard for the creators
 * @param req
 * @param res
 */
export const GetCreatorsLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await getCreatorsLeaderboard();
    if (leaderboard) {
      res.status(200).json({ leaderboard });
    } else {
      res.status(404).json({ message: "No leaderboard found" });
    }
  } catch (error) {
    console.log("Error getting creators leaderboard", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get the top fans for a given creator id
 */
export const GetTopFans = async (req: Request, res: Response) => {
  try {
    const { creatorAddress } = req.params;
    if (!creatorAddress) {
      return res.status(400).json({ message: "Creator ID is required" });
    }
    const topFans = await getTopFans(creatorAddress);
    if (topFans) {
      res.status(200).json({ topFans });
    } else {
      res.status(404).json({ message: "No top fans found" });
    }
  } catch (error) {
    console.log("Error getting top fans", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const GetRandomCreators = async (req: Request, res: Response) => {
  try {
    const randomCreators = await getRandomCreators();
    if (randomCreators.length > 0) {
      res.status(200).json({ randomCreators });
    } else {
      res.status(500).json({ message: "No random creators found" });
    }
  } catch (error) {
    console.log("Error getting random creators", error);
    res.status(500).json({ message: "Internal server error" });
  }
}