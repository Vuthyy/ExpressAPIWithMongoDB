import express from "express";
import {
  // getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
} from "../controllers/item.controller";
// import { validateItem } from "../middlewares/validateItem";
import { itemSchema } from "../middlewares/validateItem";
import { validateSchema } from "../middlewares/validateItem";

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItem);

router.post("/", validateSchema(itemSchema), createItem);

router.put("/:id", validateSchema(itemSchema), updateItem);

router.patch("/:id", updateItem);

router.delete("/:id", deleteItem);

export default router;
