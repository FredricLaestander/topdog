import { Request, Response } from "express";
import { z } from "zod";
import { TierList } from "../models/tierlist";
import { AuthenticatedRequest } from "../types";
import { Types } from "mongoose";

export async function createList(req: AuthenticatedRequest, res: Response) {
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

export async function getListById(req: Request, res: Response) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json("Id is not valid");
      return;
    }

    const list = await TierList.findById(req.params.id);

    if (!list) {
      res.status(404).json("The list was not found");
      return;
    }

    res.status(200).json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong when trying to open a list");
  }
}
