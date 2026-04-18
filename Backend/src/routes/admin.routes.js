import express from "express";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";
import {
  getPendingProperties,
  approveProperty,
  deletePropertyAdmin,
} from "../controllers/admin.controller.js";
import isAdmin from "../middlewares/admin.middleware.js";
const router = express.Router();

router.get("/properties/pending", protect, adminOnly, getPendingProperties);

router.put("/properties/:id/approve", protect, adminOnly, approveProperty);

router.delete("/properties/:id", protect, adminOnly, deletePropertyAdmin);
router.get("/properties/pending", protect, isAdmin, getPendingProperties);
router.put("/properties/:id/approve", protect, isAdmin, approveProperty);
router.delete("/properties/:id", protect, isAdmin, deleteProperty);
export default router;