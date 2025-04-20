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
      description: z.string().optional()
    });

    const { success, data, error } = createTierListSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json(error.format());
      return;
    }

    const newTierList = new TierList({
      name: data.name,
      description: data.description,
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

export async function getAllLists(req: Request, res: Response) {
  try {
    const querySchema = z.object({
      limit: z.coerce.number().min(1).optional(),
    });

    const { success, data, error } = querySchema.safeParse(req.query);

    if (!success) {
      res.status(400).json(error.format());
      return;
    }

    const limit = data.limit || 5;

    const lists = await TierList.find().limit(limit);

    res.status(200).json(lists);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong when trying to show all lists");
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

export async function updateList(req: AuthenticatedRequest, res: Response) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json("Id is not valid");
      return;
    }

    const updateTierListSchema = z.object({
      name: z.string().min(1).max(30),
      description: z.string().optional(),
    });

    const { success, data, error } = updateTierListSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json(error.format());
      return;
    }

    const updateTierList = await TierList.findByIdAndUpdate(
      req.params.id,
      {
        name: data.name,
        description: data.description,
      },
      { new: true }
    );

    res.status(200).json(updateTierList);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong when trying to open a list");
  }
}

export async function deleteList(req: AuthenticatedRequest, res: Response) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json("Id is not valid");
      return;
    }

    const deletedList = await TierList.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(`Tier list '${deletedList?.name}' was successfully deleted.`);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong when trying to delete a list");
  }
}
