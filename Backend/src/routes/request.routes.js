import express from "express";
import { createRequest, getMyRequests } from "../controllers/request.controller.js";
import {protect} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create request
router.post("/", protect, createRequest);

// Get my requests
router.get("/my", protect, getMyRequests);

export default router;