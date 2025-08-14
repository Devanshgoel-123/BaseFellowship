import express from "express";
import * as userController from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.post("/register", registerUs);
userRouter.get("/profile", userController.getUserProfile);
userRouter.post("/update-wallet", userController.updateUserWallet);
userRouter.post("/update-hits", userController.updateGameHits);
userRouter.get("/hits", userController.getUserHits);
userRouter.get("/rewards", userController.getUserRewards);
userRouter.get("/leaderboard", userController.getLeaderboard);