import express from "express";
import {
  getMyListings,
  getMyRequestsDashboard,
} from "../controllers/dashboard.controller.js";

import{ protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Seller dashboard
router.get("/listings", protect, getMyListings);

// Buyer dashboard
router.get("/requests", protect, getMyRequestsDashboard);

export default router;