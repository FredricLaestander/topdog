import { Router } from "express";
import { createUser, login } from "../controllers/auth";
import { createList, getListById, updateList } from "../controllers/lists";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyOwner } from "../middlewares/verifyOwner";

export const router = Router();

router.post("/auth/signup", createUser);
router.post("/auth/login", login);

router.post("/lists", verifyToken, createList);
router.get("/lists/:id", getListById);
router.put("/lists/:id", verifyToken, verifyOwner, updateList);
