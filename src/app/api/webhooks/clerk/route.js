import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { connectDB } from "@/lib/db";
import { upsertUserFromClerk } from "@/lib/syncUser";
import User from "@/lib/models/User";

export async function POST(request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ message: "Webhook secret is not configured" }, { status: 500 });
  }

  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id"),
    "svix-timestamp": request.headers.get("svix-timestamp"),
    "svix-signature": request.headers.get("svix-signature"),
  };

  let event;

  try {
    const webhook = new Webhook(secret);
    event = webhook.verify(payload, headers);
  } catch (error) {
    console.error("CLERK WEBHOOK VERIFY ERROR:", error);
    return NextResponse.json({ message: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    await connectDB();

    if (event.type === "user.created" || event.type === "user.updated") {
      await upsertUserFromClerk(event.data);
    }

    if (event.type === "user.deleted") {
      await User.deleteOne({ clerkId: event.data.id });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("CLERK WEBHOOK ERROR:", error);
    return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 });
  }
}
