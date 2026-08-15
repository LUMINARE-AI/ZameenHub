const DEFAULT_CENTER = { lat: 26.9124, lng: 75.7873 };

export function getDefaultMapCenter() {
  return { ...DEFAULT_CENTER };
}

export function isValidCoordinates(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function parseGoogleMapsUrl(input = "") {
  const value = String(input).trim();
  if (!value) return null;

  const atMatch = value.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const lat = Number(atMatch[1]);
    const lng = Number(atMatch[2]);
    return isValidCoordinates(lat, lng) ? { lat, lng } : null;
  }

  const qMatch = value.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (qMatch) {
    const lat = Number(qMatch[1]);
    const lng = Number(qMatch[2]);
    return isValidCoordinates(lat, lng) ? { lat, lng } : null;
  }

  const placeMatch = value.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (placeMatch) {
    const lat = Number(placeMatch[1]);
    const lng = Number(placeMatch[2]);
    return isValidCoordinates(lat, lng) ? { lat, lng } : null;
  }

  return null;
}

export function buildGoogleMapsEmbedUrl({ lat, lng, query }) {
  if (isValidCoordinates(lat, lng)) {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  if (query) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }

  return "";
}

export async function geocodeAddress(address) {
  const query = String(address || "").trim();
  if (query.length < 3) {
    throw new Error("Enter a location before searching on the map.");
  }

  const params = new URLSearchParams({
    format: "json",
    q: query,
    limit: "1",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "AsliPatta/1.0",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to search this location on the map.");
  }

  const results = await response.json();
  const match = results?.[0];

  if (!match) {
    throw new Error("Location not found. Paste a Google Maps link or drop the pin manually.");
  }

  const lat = Number(match.lat);
  const lng = Number(match.lon);

  if (!isValidCoordinates(lat, lng)) {
    throw new Error("Invalid coordinates returned for this location.");
  }

  return { lat, lng, label: match.display_name };
}
