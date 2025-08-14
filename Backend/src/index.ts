import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { adminRouter } from "./routes/admin.route.js";
import { userRouter } from "./routes/user.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});