import { Schema } from "mongoose";

export const imageSchema = new Schema(
  {
    urlpath: {
      type: String,
      required: true,
      default: "/images/defaultimage.png",
      // unique: true,
    },
  },
  {
    timestamps: true,
  }
);
