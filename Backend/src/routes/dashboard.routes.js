import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { getMyProperties } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/my-properties", protect, getMyProperties);

export default router;