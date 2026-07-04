import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { approveProperty } from "@/lib/services/adminService";

export async function PUT(request, { params }) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    await connectDB();
    const { id } = await params;
    const result = await approveProperty(id);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
