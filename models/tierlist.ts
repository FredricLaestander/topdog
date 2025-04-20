import { model, Schema } from "mongoose";
import { tierSchema } from "./tier";

const tierListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tiers: [tierSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const TierList = model("TierList", tierListSchema);
