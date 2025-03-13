import { model, Schema } from "mongoose";
import { tierSchema } from "./tier";

const tierListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tiers: [tierSchema],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const TierList = model("TierList", tierListSchema);
