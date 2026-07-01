import { NextResponse } from "next/server";

export function handleApiError(error) {
  console.error("API ERROR:", error);

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);
    return NextResponse.json(
      { message: messages[0] || "Validation failed", errors: messages },
      { status: 400 }
    );
  }

  if (error.name === "CastError") {
    return NextResponse.json({ message: "Invalid resource id" }, { status: 400 });
  }

  if (error.code === 11000) {
    return NextResponse.json(
      { message: "A record with this value already exists" },
      { status: 409 }
    );
  }

  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || "Server error";

  return NextResponse.json({ message }, { status: statusCode });
}
