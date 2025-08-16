import express from "express";
import {
  RegisterUser,
  GetUserLeaderBoard,
  GetUserProfile,
  UpdateUserGameHits,
  GetUserRewards,
  GetUserHits,
  GetWalletDetails,
} from "../controllers/userController.js";

export const UserRouter = express.Router();

UserRouter.post("/register", RegisterUser);
UserRouter.get("/profile", GetUserProfile);
UserRouter.post("/updateHits", UpdateUserGameHits);
UserRouter.get("/hits", GetUserHits);
UserRouter.get("/rewards", GetUserRewards);
UserRouter.get("/leaderboard", GetUserLeaderBoard);
UserRouter.get("/walletDetails", GetWalletDetails);
