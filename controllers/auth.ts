import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
      res
        .status(400)
        .json({ errorMessage: "Username or email has already been taken" });
      return;
    }

    const newUser = new User(data);
    await newUser.save();

    res.status(201).json(`User ${newUser.username} created`);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Something went wrong when trying to create a user",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const loginSchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { success, data, error } = loginSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json(error.format());
      return;
    }

    const user = await User.findOne({ email: data.email }, "+password");

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      res.status(400).json({ errorMessage: "Wrong email or password" });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Something went wrong when trying to login",
    });
  }
}
