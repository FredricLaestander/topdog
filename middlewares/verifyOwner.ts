import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { Types } from "mongoose";
import { TierList } from "../models/tierlist";

export async function verifyOwner(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      throw new Error("You need to run verifyToken before this function");
    }

    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        errorMessage: "List id is not valid",
      });
      return;
    }

    const list = await TierList.findById(req.params.id);

    if (!list) {
      res.status(404).json({
        errorMessage: "List id is not valid",
      });
      return;
    }

    if (req.userId !== list.user.toString()) {
      res.status(403).json({
        errorMessage: "Missing access to perform this action",
      });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Something went wrong when trying to verify the owner",
    });
  }
}
