import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { setPropertyFeatured } from "@/lib/services/adminService";

export async function PUT(request, { params }) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const featured = body.featured === true || body.featured === "true";

    await connectDB();
    const result = await setPropertyFeatured(id, featured);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
