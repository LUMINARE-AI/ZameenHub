import express from "express";
import { getMyProperties } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/my-properties", protect, getMyProperties);

export default router;