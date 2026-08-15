import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { handleApiError } from "@/lib/errors";
import { getPublicHomeContent } from "@/lib/services/homeContentService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const content = await getPublicHomeContent();
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
