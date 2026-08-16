import HomeContent from "@/lib/models/HomeContent";
import {
  DEFAULT_FOOTER_SETTINGS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_TESTIMONIALS,
} from "@/lib/homeContentDefaults";
import { destroyImage, uploadImageWithMeta } from "@/lib/upload";

function text(value) {
  return String(value || "").trim();
}

function digitsOnly(value) {
  return text(value).replace(/\D/g, "");
}

function normalizeUrl(value) {
  const raw = text(value);
  if (!raw) {
    return "";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return `https://${raw}`;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeFooterSettings(settings = {}) {
  const source = settings && typeof settings === "object" ? settings : {};
  const phone = text(source.phone);
  const email = text(source.email);
  const whatsapp = digitsOnly(source.whatsapp);
  const address = text(source.address);
  const instagram = text(source.instagram);
  const facebook = text(source.facebook);
  const twitter = text(source.twitter);

  const hasAny = phone || email || whatsapp || address || instagram || facebook || twitter;

  if (!hasAny) {
    return { ...DEFAULT_FOOTER_SETTINGS };
  }

  return {
    phone,
    email,
    whatsapp,
    address,
    instagram,
    facebook,
    twitter,
  };
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
    footerSettings: normalizeFooterSettings(doc.footerSettings),
    updatedAt: doc.updatedAt,
  };
}

export async function getOrCreateHomeContent() {
  let content = await HomeContent.findOne({ key: "default" });

  if (!content) {
    return HomeContent.create({
      key: "default",
      heroSlides: DEFAULT_HERO_SLIDES,
      testimonials: DEFAULT_TESTIMONIALS,
      testimonialsSeeded: true,
      footerSettings: DEFAULT_FOOTER_SETTINGS,
    });
  }

  let dirty = false;

  if (!Array.isArray(content.heroSlides) || content.heroSlides.length !== 3) {
    content.heroSlides = normalizeHeroSlides(content.heroSlides);
    dirty = true;
  }

  if (!content.testimonialsSeeded) {
    if (!Array.isArray(content.testimonials) || content.testimonials.length === 0) {
      content.testimonials = DEFAULT_TESTIMONIALS;
    }
    content.testimonialsSeeded = true;
    dirty = true;
  }

  if (!content.footerSettings || typeof content.footerSettings !== "object") {
    content.footerSettings = DEFAULT_FOOTER_SETTINGS;
    dirty = true;
  }

  if (dirty) {
    await content.save();
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

function validateFooterSettingsInput(body = {}) {
  const payload = {};

  if (body.phone !== undefined) {
    payload.phone = text(body.phone);
    if (payload.phone && payload.phone.length > 40) {
      return { error: "Phone must be 40 characters or fewer" };
    }
  }

  if (body.email !== undefined) {
    payload.email = text(body.email);
    if (payload.email) {
      if (payload.email.length > 120 || !isValidEmail(payload.email)) {
        return { error: "Enter a valid email address" };
      }
    }
  }

  if (body.whatsapp !== undefined) {
    payload.whatsapp = digitsOnly(body.whatsapp);
    if (payload.whatsapp && (payload.whatsapp.length < 8 || payload.whatsapp.length > 15)) {
      return { error: "WhatsApp number must be 8–15 digits (with country code)" };
    }
  }

  if (body.address !== undefined) {
    payload.address = text(body.address);
    if (payload.address && payload.address.length > 300) {
      return { error: "Address must be 300 characters or fewer" };
    }
  }

  for (const field of ["instagram", "facebook", "twitter"]) {
    if (body[field] === undefined) {
      continue;
    }

    const raw = text(body[field]);
    if (!raw) {
      payload[field] = "";
      continue;
    }

    const normalized = normalizeUrl(raw);
    if (!isValidHttpUrl(normalized) || normalized.length > 300) {
      return { error: `Enter a valid ${field} URL` };
    }
    payload[field] = normalized;
  }

  return { payload };
}

export async function updateFooterSettings(body) {
  const { payload, error } = validateFooterSettingsInput(body);

  if (error) {
    const err = new Error(error);
    err.status = 400;
    throw err;
  }

  const content = await getOrCreateHomeContent();
  const current = normalizeFooterSettings(content.footerSettings);
  const next = {
    ...current,
    ...payload,
  };

  if (!next.email && !next.whatsapp) {
    const err = new Error("Provide at least an email or WhatsApp number");
    err.status = 400;
    throw err;
  }

  content.footerSettings = next;
  await content.save();

  return serializeHomeContent(content);
}
