import express from "express";
import { addProperty, getProperties } from "../controllers/property.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Add property (login required)
router.post("/", protect, addProperty);

// Get properties (public)
router.get("/", getProperties);

export default router;