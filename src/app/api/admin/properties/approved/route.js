import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { listApprovedPropertiesForAdmin } from "@/lib/services/adminService";

export async function GET(request) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    await connectDB();
    const properties = await listApprovedPropertiesForAdmin(search);

    return NextResponse.json(properties);
  } catch (error) {
    return handleApiError(error);
  }
}
