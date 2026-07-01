import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { createProperty, listProperties } from "@/lib/services/propertyService";

export async function GET(request) {
  try {
    await connectDB();
    const properties = await listProperties(request.nextUrl.searchParams);
    return NextResponse.json(properties);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    await connectDB();
    const formData = await request.formData();
    const result = await createProperty(formData, auth.user);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
