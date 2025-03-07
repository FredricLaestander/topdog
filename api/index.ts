import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "../database/db";
import Movie from "../models/movie";
import { defaultMaxListeners } from "events";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  const data = await Movie.find({}).select("title plot runtime year").limit(5);
  console.log(data);
  res.json({ message: "This is a backend application" });
});

app.listen(PORT, () => {
  console.log(`Application is running at http://localhost:${PORT}`);
});

export default app;