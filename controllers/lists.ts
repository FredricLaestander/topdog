import { Request, Response } from "express";
import { string, z } from "zod";
import { TierList } from "../models/tierlist";
import { AuthenticatedRequest } from "../types";

export async function createTierList(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;

    const createTierListSchema = z.object({
      name: z.string().min(1).max(30),
    });

    const { success, data, error } = createTierListSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json(error.format());
      return;
    }

    const newTierList = new TierList({
      name: data.name,
      userId,
      tiers: [
        {
          name: "S",
          color: "#e68683",
          order: 1,
        },
        {
          name: "A",
          color: "#efc189",
          order: 2,
        },
        {
          name: "B",
          color: "#f5df8d",
          order: 3,
        },
        {
          name: "C",
          color: "#fcfe92",
          order: 4,
        },
        {
          name: "D",
          color: "#cffc90",
          order: 5,
        },
      ],
    });

    await newTierList.save();

    res.status(201).json(`List: ${newTierList.name} created`);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong when trying to create a list");
  }
}
