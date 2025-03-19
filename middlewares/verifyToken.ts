import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { AuthenticatedRequest } from "../types";

export async function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;
  const accessToken = authorizationHeader?.split(" ")[1];

  if (!accessToken) {
    res.status(401).json("Could not find access token");
    return;
  }

  try {
    const verifiedAccessToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    );

    const accessTokenSchema = z.object({
      userId: z.string(),
    });

    const { success, data } = accessTokenSchema.safeParse(verifiedAccessToken);

    if (!success || !(await User.exists({ _id: data.userId }))) {
      res.status(401).json("Unauthenticated action");
      return;
    }

    req.userId = data.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json("Could not authenticate user");
  }
}
