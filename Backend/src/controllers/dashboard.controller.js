import Property from "../models/property.model.js";
import Request from "../models/request.model.js";


// 🏠 SELLER DASHBOARD
export const getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });

    // Har property ke saath requests attach karo
    const data = await Promise.all(
      properties.map(async (property) => {
        const requests = await Request.find({ property: property._id })
          .populate("buyer", "name phone");

        return {
          property,
          requests,
        };
      })
    );

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🛒 BUYER DASHBOARD
export const getMyRequestsDashboard = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.user.id })
      .populate("property");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};