import Property from "@/lib/models/Property";

export async function getMyProperties(userId) {
  return Property.find({ owner: userId })
    .populate("owner", "name phone")
    .sort({ createdAt: -1 });
}
