import { Router } from "express";
import { createUser } from "../controllers/auth";

export const router = Router();

router.post("/users", createUser);
