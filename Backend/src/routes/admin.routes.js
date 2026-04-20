import express from "express";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";
import {
  getPendingProperties,
  approveProperty,
  deletePropertyAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/properties/pending", protect, adminOnly, getPendingProperties);
router.put("/properties/:id/approve", protect, adminOnly, approveProperty);
router.delete("/properties/:id", protect, adminOnly, deletePropertyAdmin);

export default router;
