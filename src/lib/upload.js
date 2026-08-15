import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function validateImageFile(file) {
  if (!file || typeof file === "string") {
    return null;
  }

  if (!file.type?.startsWith("image/")) {
    throw new Error("Only image uploads are allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be 5MB or smaller");
  }

  return file;
}

export async function uploadImageWithMeta(file, options = {}) {
  const validFile = validateImageFile(file);

  if (!validFile) {
    return null;
  }

  const bytes = await validFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "asli-patta",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          secure_url: result?.secure_url || "",
          public_id: result?.public_id || "",
        });
      }
    );

    stream.end(buffer);
  });
}

export async function uploadImage(file, options = {}) {
  const result = await uploadImageWithMeta(file, options);
  return result?.secure_url || "";
}

export async function destroyImage(publicId) {
  if (!publicId || publicId.startsWith("/")) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error("Cloudinary destroy failed:", error);
  }
}
