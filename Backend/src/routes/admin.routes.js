import express from "express";
import {
  getPendingProperties,
  approveProperty
} from "../controllers/admin.controller.js";

import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/pending", protect, isAdmin, getPendingProperties);
router.put("/:id/approve", protect, isAdmin, approveProperty);

export default router;