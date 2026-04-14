import Request from "../models/request.model.js";

import { verifiedUsers } from "./otp.controller.js";

// ➕ CREATE REQUEST
export const createRequest = async (req, res) => {
  try {
    const { propertyId, phone } = req.body;

    // ❗ CHECK OTP VERIFIED
    if (!verifiedUsers[phone]) {
      return res.status(401).json({ message: "OTP not verified" });
    }

    const request = await Request.create({
      property: propertyId,
      buyer: req.user.id,
    });

    // remove verification after use
    delete verifiedUsers[phone];

    res.status(201).json(request);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📄 GET USER REQUESTS (Dashboard)
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.user.id })
      .populate("property");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};