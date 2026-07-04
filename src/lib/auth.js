import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { upsertUserFromClerk } from "@/lib/syncUser";

export async function getDbUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  await connectDB();

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    user = await upsertUserFromClerk(clerkUser);
  }

  return user;
}

export async function requireUser() {
  const user = await getDbUser();

  if (!user) {
    return { ok: false, status: 401, message: "Login required" };
  }

  return { ok: true, user };
}

export async function requireAdmin() {
  const result = await requireUser();

  if (!result.ok) {
    return result;
  }

  if (result.user.role !== "admin") {
    return { ok: false, status: 403, message: "Admin only access" };
  }

  return result;
}
