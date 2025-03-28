import { Router } from "express";
import { createUser, login } from "../controllers/auth";
import {
  createList,
  deleteList,
  getAllLists,
  getListById,
  updateList,
} from "../controllers/lists";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyOwner } from "../middlewares/verifyOwner";
import { createTier } from "../controllers/tiers";

export const router = Router();

router.post("/auth/signup", createUser);
router.post("/auth/login", login);

router.post("/lists", verifyToken, createList);
router.get("/lists", getAllLists);
router.get("/lists/:id", getListById);
router.put("/lists/:id", verifyToken, verifyOwner, updateList);
router.delete("/lists/:id", verifyToken, verifyOwner, deleteList);

router.post("/lists/:id/tiers", verifyToken, verifyOwner, createTier);
