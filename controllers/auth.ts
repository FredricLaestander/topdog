import { Request, Response } from "express";
import { z } from "zod";

import { User } from "../models/user";

export async function createUser(req: Request, res: Response) {
  try {
    const createUserSchema = z.object({
      username: z.string().min(3).max(20),
      email: z.string().email(),
      password: z.string().min(8).max(30),
    });

    const { success, data, error } = createUserSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json(error.format());
      return;
    }

    if (
      await User.exists({
        $or: [{ username: data.username }, { email: data.email }],
      })
    ) {
      res.status(400).json("Username or email has already been taken");
      return;
    }

    const newUser = new User(data);
    await newUser.save();

    res.status(201).json(`User ${newUser.username} created`);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong when trying to create a user");
  }
}
