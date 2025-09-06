import axios from "axios";
import dotenv from "dotenv";
import { Creator } from "~/lib/bubbleType";
dotenv.config();
const BASE_CREATOR_URL =
  process.env.BACKEND_URL ||
  "https://basefellowship-production.up.railway.app/api/v1";

export const getCreatorProfile = async ({
  creatorAddress,
}: {
  creatorAddress: string;
}) => {
  try {
    const response = await axios.get(`${BASE_CREATOR_URL}/creator/profile`, {
      params: {
        creatorAddress,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching creator profile", error);
    throw error;
  }
};

export const getCreatorLeaderBoard = async () => {
  try {
    const response = await axios.get(`${BASE_CREATOR_URL}/creator/leaderboard`);
    return response.data;
  } catch (error) {
    console.log("Error fetching creator leaderboard", error);
    throw error;
  }
};

export const getCreatorTopFans = async ({
  creatorAddress,
}: {
  creatorAddress: string;
}) => {
  try {
    const response = await axios.get(`${BASE_CREATOR_URL}/creator/topFans`, {
      params: {
        creatorAddress,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching creator top fans", error);
    throw error;
  }
};

/**
 * Get random creators
 * @returns random creators
 */
export const getRandomCreators = async (): Promise<Creator[]> => {
  try {
    // const response = await axios.get(`${BASE_CREATOR_URL}/creator/getCreators`);
    // // return response.data.randomCreators;
    return randomCreators;
  } catch (error) {
    console.log("Error fetching random creators", error);
    throw error;
  }
};

export const randomCreators: Creator[] = [
  {
    id: 1,
    creatorAddress: "0x2f60554fada00a128e53b055a5ebfefe6fc2d53b",
    displayName: "SaxenaSahab",
    totalHits: 0,
    createdAt: new Date("2025-08-17 17:28:43.983759"),
    coinAddress: "0xf3922e301c8ea21a52ecd9e6c0f708557611e8e6",
    pfp: "https://ik.imagekit.io/0fb6jryix/Group%2038.png?updatedAt=1755442886811",
    message: "BASED",
  },
  {
    id: 4,
    creatorAddress: "0x2F60554FADA00a128e53b055a5eBfeFe6Fc2D53d",
    displayName: "Jesse",
    totalHits: 0,
    createdAt: new Date("2025-08-17 17:30:16.572313"),
    coinAddress: "0x29aef64de9460338a9947b6561825eefe7d5fa4a",
    pfp: "https://ik.imagekit.io/0fb6jryix/QngrqCSC_400x400%201.png?updatedAt=1755442978136",
    message: "Bullish on Base",
  },
  {
    id: 5,
    creatorAddress: "0x2F60554FADA00a128e53b055a5eBfeFe6Fc2D53e",
    displayName: "AymanWeb3",
    totalHits: 0,
    createdAt: new Date("2025-08-17 17:31:05.340003"),
    coinAddress: "0xea71a08bb70a19538473c43a6c4fa7912ad077fe",
    pfp: "https://ik.imagekit.io/0fb6jryix/Group%2044.png?updatedAt=1755443034371",
    message: "Bullish on FBI!!",
  },
  {
    id: 7,
    creatorAddress: "0x2F60554FADA00a128e53b055a5eBfeFe6Fc2D53z",
    displayName: "ShuklaJi",
    totalHits: 0,
    createdAt: new Date("2025-08-17 17:32:19.618019"),
    coinAddress: "0xb39ed36589a3508ad8a78e170551a26c7dfecb2e",
    pfp: "https://ik.imagekit.io/0fb6jryix/shukla.jpg?updatedAt=1755443086720",
    message: "You Got Rewarded OnChain!!",
  },
];
