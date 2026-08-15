import Property from "@/lib/models/Property";
import User from "@/lib/models/User";

function text(value) {
  return String(value || "").trim();
}

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

export async function listApprovedPropertiesForAdmin(search = "") {
  const filters = { status: "approved" };
  const query = text(search);

  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ];
  }

  return Property.find(filters)
    .populate("owner", "name phone role")
    .sort({ featured: -1, createdAt: -1 })
    .limit(100);
}

export async function setPropertyFeatured(id, featured) {
  const property = await Property.findById(id);

  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  if (property.status !== "approved") {
    const error = new Error("Only approved properties can be featured");
    error.status = 400;
    throw error;
  }

  property.featured = Boolean(featured);
  await property.save();

  return {
    message: property.featured ? "Property marked as featured" : "Property removed from featured",
    property,
  };
}

export async function listUsersForAdmin(search = "") {
  const filters = {};
  const query = text(search);

  if (query) {
    filters.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { phone: { $regex: query, $options: "i" } },
    ];
  }

  return User.find(filters).sort({ createdAt: -1 }).limit(100);
}

export async function countAdmins() {
  return User.countDocuments({ role: "admin" });
}

export async function updateUserRole({ targetUserId, nextRole, actor }) {
  const role = text(nextRole);

  if (!["user", "admin"].includes(role)) {
    const error = new Error("Role must be user or admin");
    error.status = 400;
    throw error;
  }

  const target = await User.findById(targetUserId);

  if (!target) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (target._id.toString() === actor._id.toString()) {
    const error = new Error("You cannot change your own role");
    error.status = 400;
    throw error;
  }

  if (target.role === "admin" && role === "user") {
    const adminCount = await countAdmins();

    if (adminCount <= 1) {
      const error = new Error("Cannot demote the last remaining admin");
      error.status = 400;
      throw error;
    }
  }

  if (target.role === role) {
    return {
      message: "Role unchanged",
      user: target,
    };
  }

  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(target.clerkId);
  const existingPublicMetadata = clerkUser.publicMetadata || {};

  await client.users.updateUserMetadata(target.clerkId, {
    publicMetadata: {
      ...existingPublicMetadata,
      role,
    },
  });

  target.role = role;
  await target.save();

  return {
    message: `User role updated to ${role}`,
    user: target,
  };
}
