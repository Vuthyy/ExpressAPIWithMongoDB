import express from "express";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controller";
import { validateItem } from "../middlewares/validateItem";

const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItem);

router.post("/", validateItem, createItem);

router.put("/:id", validateItem, updateItem);

router.patch("/:id", updateItem);

router.delete("/:id", deleteItem);

export default router;
