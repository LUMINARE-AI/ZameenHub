import User from "@/lib/models/User";

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

export function mapClerkUser(clerkUser) {
  const emailAddresses = clerkUser.email_addresses || clerkUser.emailAddresses || [];
  const phoneNumbers = clerkUser.phone_numbers || clerkUser.phoneNumbers || [];
  const primaryEmailId =
    clerkUser.primary_email_address_id || clerkUser.primaryEmailAddressId;
  const primaryPhoneId =
    clerkUser.primary_phone_number_id || clerkUser.primaryPhoneNumberId;
  const publicMetadata = clerkUser.public_metadata || clerkUser.publicMetadata || {};

  const primaryEmail =
    emailAddresses.find((item) => item.id === primaryEmailId)?.email_address ||
    emailAddresses.find((item) => item.id === primaryEmailId)?.emailAddress ||
    emailAddresses[0]?.email_address ||
    emailAddresses[0]?.emailAddress ||
    clerkUser.primaryEmailAddress?.emailAddress ||
    "";

  const primaryPhone =
    phoneNumbers.find((item) => item.id === primaryPhoneId)?.phone_number ||
    phoneNumbers.find((item) => item.id === primaryPhoneId)?.phoneNumber ||
    phoneNumbers[0]?.phone_number ||
    phoneNumbers[0]?.phoneNumber ||
    "";

  const role = publicMetadata.role === "admin" ? "admin" : "user";

  const name =
    clerkUser.fullName ||
    [clerkUser.first_name || clerkUser.firstName, clerkUser.last_name || clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    clerkUser.username ||
    "User";

  return {
    clerkId: clerkUser.id,
    name,
    email: primaryEmail,
    phone: normalizePhone(primaryPhone || publicMetadata.phone),
    role,
  };
}

export async function upsertUserFromClerk(clerkUser) {
  const payload = mapClerkUser(clerkUser);

  return User.findOneAndUpdate({ clerkId: payload.clerkId }, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}
