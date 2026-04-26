import express from "express";
import {
  addProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  rateProperty,
} from "../controllers/property.controller.js";

import protect from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), addProperty);
router.get("/", getProperties);
router.post("/:id/rate", protect, rateProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

export default router;
