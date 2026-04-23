export const BUY_CATEGORIES = [
  "Plots",
  "Commercial Land",
  "Agricultural Land",
  "Flats",
  "Shops",
];

export const RENT_CATEGORIES = ["Shops", "PG", "Flats / Homes"];

export const PROPERTY_CATEGORIES = Array.from(
  new Set([...BUY_CATEGORIES, ...RENT_CATEGORIES])
);

export function formatPrice(price) {
  if (!price && price !== 0) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area) {
  if (!area) {
    return "Area on request";
  }

  return `${Number(area).toLocaleString("en-IN")} sqft`;
}

export function normalizeProperty(property, index = 0) {
  const numericPrice = Number(property.price) || 0;
  const numericBedrooms = Number(property.bedrooms || property.bhk) || 3;
  const numericBathrooms = Number(property.bathrooms) || Math.max(2, numericBedrooms - 1);
  const numericArea = Number(property.area) || 1600 + index * 180;
  const location = property.location || property.city || "Prime location";
  const primaryImage =
    property.image ||
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

  return {
    ...property,
    _id: property._id || property.id || `generated-${index}`,
    title: property.title || "Premium Residence",
    category: property.category || "Plots",
    price: numericPrice,
    location,
    city: property.city || location.split(",")[0],
    type: property.type || "Apartment",
    bedrooms: numericBedrooms,
    bathrooms: numericBathrooms,
    area: numericArea,
    description:
      property.description ||
      "Thoughtfully designed interiors, quality finishes, and a refined neighborhood experience.",
    image: primaryImage,
    images:
      property.images && property.images.length > 0
        ? property.images
        : [primaryImage, primaryImage, primaryImage],
    contact: property.contact || property.owner?.phone || "",
    owner: property.owner || null,
    status: property.status || "approved",
    featured: Boolean(property.featured),
    createdAt: property.createdAt || new Date().toISOString(),
  };
}

export function filterProperties(properties, filters) {
  return properties.filter((property) => {
    const matchesLocation =
      !filters.location ||
      property.location.toLowerCase().includes(filters.location.toLowerCase()) ||
      property.city.toLowerCase().includes(filters.location.toLowerCase());
    const matchesType = !filters.type || property.type === filters.type;
    const matchesCategory =
      !filters.category ||
      (Array.isArray(filters.category)
        ? filters.category.includes(property.category)
        : property.category === filters.category);
    const matchesBedrooms = !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms);
    const matchesPrice = property.price <= filters.maxPrice;

    return matchesLocation && matchesType && matchesCategory && matchesBedrooms && matchesPrice;
  });
}

export function sortProperties(properties, sortBy) {
  const sorted = [...properties];

  if (sortBy === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return sorted;
}
