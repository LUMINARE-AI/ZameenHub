import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { replaceHeroSlide } from "@/lib/services/homeContentService";

export async function PUT(request) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const formData = await request.formData();
    const slot = formData.get("slot");
    const image = formData.get("image");

    if (!image || typeof image === "string") {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    await connectDB();
    const content = await replaceHeroSlide(slot, image);

    return NextResponse.json({
      message: "Hero image updated successfully",
      ...content,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
