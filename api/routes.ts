import { Router } from "express";
import { createUser, login } from "../controllers/auth";
import { createTierList } from "../controllers/lists";
import { verifyToken } from "../middlewares/verifyToken";

export const router = Router();

router.post("/auth/signup", createUser);
router.post("/auth/login", login);

router.post("/lists", verifyToken, createTierList);
