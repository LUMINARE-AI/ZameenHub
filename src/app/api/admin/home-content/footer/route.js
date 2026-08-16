import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { updateFooterSettings } from "@/lib/services/homeContentService";

export async function PUT(request) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const body = await request.json();
    await connectDB();
    const content = await updateFooterSettings(body);

    return NextResponse.json({
      message: "Footer settings updated successfully",
      ...content,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
