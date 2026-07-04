import Property from "@/lib/models/Property";

export async function getPendingProperties() {
  return Property.find({ status: "pending" })
    .populate("owner", "name phone role")
    .sort({ createdAt: -1 });
}

export async function approveProperty(id) {
  const property = await Property.findById(id);

  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  property.status = "approved";
  await property.save();

  return {
    message: "Property approved successfully",
    property,
  };
}

export async function deletePropertyAdmin(id) {
  const property = await Property.findByIdAndDelete(id);

  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  return { message: "Property deleted by admin" };
}
