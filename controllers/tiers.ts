import { Request, Response } from "express";
import { z } from "zod";
import { TierList } from "../models/tierlist";
import { AuthenticatedRequest } from "../types";
import { Types } from "mongoose";

export async function createTier(req: AuthenticatedRequest, res: Response) {
  try {
    const createTierSchema = z.object({
      name: z.string().min(1).max(30),
      order: z.number(),
      color: z.string(),
    });

    const { success, data, error } = createTierSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json(error.format());
      return;
    }

    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json("Id is not valid");
      return;
    }
    const list = await TierList.findById(req.params.id);

    if (!list) {
      res.status(404).json("The list was not found");
      return;
    }

    list.tiers.forEach((tier) => {
      if (tier.order >= data.order) {
        tier.order = tier.order + 1;
      }
    });

    list.tiers.push({
      name: data.name,
      order: data.order,
      color: data.color,
    });

    list.tiers.sort((a, b) => a.order - b.order);

    list.save();
    res.status(201).json(`Tier: ${data.name} created`);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong when trying to create a tier");
  }
}
