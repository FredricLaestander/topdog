import { Schema } from "mongoose";

export const imageSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
