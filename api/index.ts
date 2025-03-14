import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../database/db";
import { router } from "./routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL!],
  })
);
app.use(router);

connectDB().then(() => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Application is running at http://localhost:${port}`);
  });
});

export default app;
