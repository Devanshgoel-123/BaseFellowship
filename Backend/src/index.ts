import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { creatorRouter } from "./routes/creatorRoute.js";
import { UserRouter } from "./routes/userRoute.js";
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

if (NEYNAR_API_KEY === undefined) {
  throw new Error("Env var misisng");
}
const config = new Configuration({
  apiKey: NEYNAR_API_KEY,
});

export const client = new NeynarAPIClient(config);

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/creator", creatorRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
