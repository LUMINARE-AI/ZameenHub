import express from "express";
import {
  getPendingProperties,
  approveProperty,
} from "../controllers/admin.controller.js";

import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all pending properties
router.get("/properties/pending", protect, isAdmin, getPendingProperties);

// Approve property
router.put("/properties/:id/approve", protect, isAdmin, approveProperty);

export default router;