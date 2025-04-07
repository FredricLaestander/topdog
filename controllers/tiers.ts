import { Response } from "express";
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

export async function updateTier(req: AuthenticatedRequest, res: Response) {
  // hitta listan genom URLen
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json("List id is not valid");
    return;
  }

  // validera input
  const updateTierSchema = z.object({
    name: z.string().max(30).optional(),
    color: z.string().optional(),
    order: z.number().optional(),
  });

  const { success, data, error } = updateTierSchema.safeParse(req.body);

  console.log({ data });

  if (!success) {
    res.status(400).json(error.format());
    return;
  }

  // // hitta specifik tier baserad på tierId
  const list = await TierList.findById(req.params.id);
  if (!list) {
    res.status(400).json("List was not found");
    return;
  }

  const tier = list.tiers.find(
    (tier) => tier._id.toString() === req.params.tierId
  );

  console.log("tier fetched: ", tier?.name, tier?.order);

  if (!tier) {
    res.status(400).json("Tier was not found");
    return;
  }

  console.log({
    oldListTiers: list.tiers.map((tier) => ({
      order: tier.order,
      name: tier.name,
      id: tier._id,
    })),
  });

  // skapa en if-sats för kolla om ett tier byter värde och dynamiskt byt order-value på alla tiers med loopar
  const oldOrder = tier.order;
  const newOrder = data.order;

  if (newOrder) {
    const direction = oldOrder - newOrder < 0 ? "descending" : "ascending";

    console.log({ oldOrder, newOrder, direction });

    list.tiers.forEach((tier) => {
      console.log("running calculation");
      if (direction === "ascending") {
        console.log("tier order asc: ", tier.order);
        if (tier.order > oldOrder && tier.order <= newOrder) {
          tier.order -= 1;
        } else {
          console.log("Calc didnt work");
        }
      } else if (direction === "descending") {
        console.log("tier order desc: ", tier.order);
        if (
          (tier.order < newOrder && tier.order != 1) ||
          (tier.order === newOrder && newOrder != 1)
        ) {
          console.log(
            `om ${tier.order} är mindre än ${newOrder} och ${tier.order} inte är 1 eller ${tier.order} är samma som ${newOrder} och ${newOrder} inte är 1, ta bort 1`
          );
          tier.order -= 1;
        } else if (tier.order > newOrder) {
          console.log(`om ${tier.order} är större än ${newOrder} ta bort 1`);
          console.log(`${tier.order} är större än ${newOrder}. Gör ingenting.`);
        } else {
          console.log("Atlest we tried");
        }
      } else {
        console.log("didnt work");
      }
    });

    tier.order = newOrder;
    console.log("updated tier: ", tier.name, tier.order);
  }

  // Sort tiers in descending order
  list.tiers.sort((a, b) => a.order - b.order);

  console.log({
    newListTiers: list.tiers.map((tier) => ({
      order: tier.order,
      name: tier.name,
      id: tier._id,
    })),
  });

  // Save changes and return success response
  // await list.save();
  res.sendStatus(200);
}

// Sortera tiers igen på order
// spara ändringar och returnera
