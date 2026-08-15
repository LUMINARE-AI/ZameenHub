import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import {
  deleteTestimonial,
  updateTestimonial,
} from "@/lib/services/homeContentService";

export async function PUT(request, { params }) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    await connectDB();
    const content = await updateTestimonial(id, body);

    return NextResponse.json({
      message: "Testimonial updated successfully",
      ...content,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { id } = await params;
    await connectDB();
    const content = await deleteTestimonial(id);

    return NextResponse.json({
      message: "Testimonial deleted successfully",
      ...content,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
