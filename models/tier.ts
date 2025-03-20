import { Schema } from "mongoose";
import { imageSchema } from "./image";

export const tierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
      default: "#525252",
    },
    images: {
      type: [imageSchema],
    },
  },
  { timestamps: true }
);
