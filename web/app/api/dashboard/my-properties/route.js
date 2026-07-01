import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { getMyProperties } from "@/lib/services/dashboardService";

export async function GET() {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    await connectDB();
    const properties = await getMyProperties(auth.user._id);

    return NextResponse.json(properties);
  } catch (error) {
    return handleApiError(error);
  }
}
