import HomeContent from "@/lib/models/HomeContent";
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_TESTIMONIALS,
} from "@/lib/homeContentDefaults";
import { destroyImage, uploadImageWithMeta } from "@/lib/upload";

function text(value) {
  return String(value || "").trim();
}

function normalizeHeroSlides(slides = []) {
  return DEFAULT_HERO_SLIDES.map((fallback, index) => {
    const match =
      slides.find((slide) => Number(slide.slot) === index) ||
      slides[index] ||
      fallback;

    return {
      slot: index,
      url: text(match.url) || fallback.url,
      publicId: text(match.publicId),
      title: text(match.title) || fallback.title,
      description: text(match.description) || fallback.description,
    };
  });
}

function normalizeTestimonials(testimonials = []) {
  return [...testimonials]
    .map((item, index) => ({
      _id: item._id?.toString?.() || item._id,
      name: text(item.name),
      role: text(item.role),
      quote: text(item.quote),
      rating: Number(item.rating) || 5,
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : index,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
    .filter((item) => item.name && item.role && item.quote)
    .sort((a, b) => a.order - b.order || String(a._id).localeCompare(String(b._id)));
}

function serializeHomeContent(doc) {
  return {
    heroSlides: normalizeHeroSlides(doc.heroSlides),
    testimonials: normalizeTestimonials(doc.testimonials),
    updatedAt: doc.updatedAt,
  };
}

export async function getOrCreateHomeContent() {
  let content = await HomeContent.findOne({ key: "default" });

  if (!content) {
    content = await HomeContent.create({
      key: "default",
      heroSlides: DEFAULT_HERO_SLIDES,
      testimonials: DEFAULT_TESTIMONIALS,
    });
  } else {
    let dirty = false;

    if (!Array.isArray(content.heroSlides) || content.heroSlides.length !== 3) {
      content.heroSlides = normalizeHeroSlides(content.heroSlides);
      dirty = true;
    }

    if (!Array.isArray(content.testimonials) || content.testimonials.length === 0) {
      content.testimonials = DEFAULT_TESTIMONIALS;
      dirty = true;
    }

    if (dirty) {
      await content.save();
    }
  }

  return content;
}

export async function getPublicHomeContent() {
  const content = await getOrCreateHomeContent();
  return serializeHomeContent(content);
}

export async function replaceHeroSlide(slot, file) {
  const index = Number(slot);

  if (!Number.isInteger(index) || index < 0 || index > 2) {
    const error = new Error("Hero slot must be 0, 1, or 2");
    error.status = 400;
    throw error;
  }

  const content = await getOrCreateHomeContent();
  const slides = normalizeHeroSlides(content.heroSlides);
  const current = slides[index];
  const uploaded = await uploadImageWithMeta(file, { folder: "asli-patta/hero" });

  if (!uploaded?.secure_url) {
    const error = new Error("Hero image upload failed");
    error.status = 400;
    throw error;
  }

  const previousPublicId = current.publicId;
  slides[index] = {
    ...current,
    slot: index,
    url: uploaded.secure_url,
    publicId: uploaded.public_id || "",
  };

  content.heroSlides = slides;
  await content.save();

  if (previousPublicId && previousPublicId !== uploaded.public_id) {
    await destroyImage(previousPublicId);
  }

  return serializeHomeContent(content);
}

function validateTestimonialInput(body, { partial = false } = {}) {
  const payload = {};

  if (!partial || body.name !== undefined) {
    payload.name = text(body.name);
    if (!payload.name || payload.name.length < 2 || payload.name.length > 80) {
      return { error: "Name must be between 2 and 80 characters" };
    }
  }

  if (!partial || body.role !== undefined) {
    payload.role = text(body.role);
    if (!payload.role || payload.role.length < 2 || payload.role.length > 120) {
      return { error: "Role must be between 2 and 120 characters" };
    }
  }

  if (!partial || body.quote !== undefined) {
    payload.quote = text(body.quote);
    if (!payload.quote || payload.quote.length < 10 || payload.quote.length > 500) {
      return { error: "Quote must be between 10 and 500 characters" };
    }
  }

  if (!partial || body.rating !== undefined) {
    const rating = Number(body.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return { error: "Rating must be between 1 and 5" };
    }
    payload.rating = Math.round(rating);
  }

  if (body.order !== undefined) {
    const order = Number(body.order);
    if (!Number.isFinite(order)) {
      return { error: "Order must be a number" };
    }
    payload.order = order;
  }

  return { payload };
}

export async function createTestimonial(body) {
  const { payload, error } = validateTestimonialInput(body);

  if (error) {
    const err = new Error(error);
    err.status = 400;
    throw err;
  }

  const content = await getOrCreateHomeContent();
  const nextOrder =
    payload.order ??
    (content.testimonials.reduce((max, item) => Math.max(max, Number(item.order) || 0), -1) + 1);

  content.testimonials.push({
    ...payload,
    order: nextOrder,
  });
  await content.save();

  return serializeHomeContent(content);
}

export async function updateTestimonial(id, body) {
  const { payload, error } = validateTestimonialInput(body, { partial: true });

  if (error) {
    const err = new Error(error);
    err.status = 400;
    throw err;
  }

  const content = await getOrCreateHomeContent();
  const testimonial = content.testimonials.id(id);

  if (!testimonial) {
    const err = new Error("Testimonial not found");
    err.status = 404;
    throw err;
  }

  Object.assign(testimonial, payload);
  await content.save();

  return serializeHomeContent(content);
}

export async function deleteTestimonial(id) {
  const content = await getOrCreateHomeContent();
  const testimonial = content.testimonials.id(id);

  if (!testimonial) {
    const error = new Error("Testimonial not found");
    error.status = 404;
    throw error;
  }

  testimonial.deleteOne();
  await content.save();

  return serializeHomeContent(content);
}
