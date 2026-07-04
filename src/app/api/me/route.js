import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";

export async function GET() {
  try {
    const user = await getDbUser();

    if (!user) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    await connectDB();

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
