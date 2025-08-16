import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const BASE_CREATOR_URL =
  `${process.env.BACKEND_URL}` || "http://localhost:3000/api/v1";

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
