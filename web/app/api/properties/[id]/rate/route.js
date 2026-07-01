import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { rateProperty } from "@/lib/services/propertyService";

export async function POST(request, { params }) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    await connectDB();
    const body = await request.json();
    const { id } = await params;
    const result = await rateProperty(id, body, auth.user);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
