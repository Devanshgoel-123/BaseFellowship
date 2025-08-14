import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { adminRouter } from "./routes/admin.route.js";
import { UserRouter } from "./routes/userRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/creator", CreatorRouter);


app.get("/health", (req, res) => {
  res.status(200).json({message: 'Server is running'});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});