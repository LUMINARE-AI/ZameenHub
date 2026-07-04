import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { deleteProperty, updateProperty } from "@/lib/services/propertyService";

export async function PUT(request, { params }) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    await connectDB();
    const body = await request.json();
    const { id } = await params;
    const result = await updateProperty(id, body, auth.user);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    await connectDB();
    const { id } = await params;
    const result = await deleteProperty(id, auth.user);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
