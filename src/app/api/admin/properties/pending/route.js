import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { getPendingProperties } from "@/lib/services/adminService";

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    await connectDB();
    const properties = await getPendingProperties();

    return NextResponse.json(properties);
  } catch (error) {
    return handleApiError(error);
  }
}
