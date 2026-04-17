import express from "express";
import {
  addProperty,
  getProperties,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addProperty);
router.get("/", getProperties);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

export default router;