import { Router } from "express";
import { createUser, login } from "../controllers/auth";

export const router = Router();

router.post("/auth/signup", createUser);
router.post("/auth/login", login);
