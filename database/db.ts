import mongoose from "mongoose";

async function connectDB() {
  try {
    const URL = process.env.MONGO_URL || "";
    await mongoose.connect(URL);
    console.log("Database connected successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error while connecting to databade: ${error.message}`);
    }
  }
}

export default connectDB;
