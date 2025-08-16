import { Router } from "express";
import {
  GetCreatorProfile,
  GetCreatorsLeaderboard,
  GetTopFans,
  RegisterCreator,
} from "../controllers/creatorController.js";

export const creatorRouter = Router();

creatorRouter.post("/register", RegisterCreator);
creatorRouter.get("/profile", GetCreatorProfile);
creatorRouter.get("/leaderboard", GetCreatorsLeaderboard);
creatorRouter.get("/topFans", GetTopFans);
