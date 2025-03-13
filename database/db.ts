import mongoose from "mongoose";

export async function connectDB() {
  try {
    const URL = process.env.MONGO_URL || "";
    await mongoose.connect(URL);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error while connecting to databade: ${error.message}`);
    }
  }
}
