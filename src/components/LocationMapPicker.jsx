"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link2, Loader2, MapPin, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  geocodeAddress,
  getDefaultMapCenter,
  isValidCoordinates,
  parseGoogleMapsUrl,
} from "@/lib/maps";

function createMarkerIcon(L) {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export default function LocationMapPicker({
  latitude,
  longitude,
  onCoordinatesChange,
  address = "",
  error = "",
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletRef = useRef(null);
  const [mapsLink, setMapsLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [searching, setSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const hasCoordinates = isValidCoordinates(latitude, longitude);

  const setMarkerPosition = useCallback(
    (lat, lng, { moveMap = true } = {}) => {
      const L = leafletRef.current;
      const map = mapRef.current;
      if (!L || !map) return;

      if (!markerRef.current) {
        const marker = L.marker([lat, lng], {
          draggable: true,
          icon: createMarkerIcon(L),
        }).addTo(map);

        marker.on("dragend", () => {
          const position = marker.getLatLng();
          onCoordinatesChange(position.lat, position.lng);
        });

        markerRef.current = marker;
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      if (moveMap) {
        map.setView([lat, lng], 15, { animate: true });
      }
    },
    [onCoordinatesChange]
  );

  useEffect(() => {
    let active = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!active || !mapContainerRef.current || mapRef.current) {
        return;
      }

      leafletRef.current = L;
      const defaultCenter = getDefaultMapCenter();
      const startLat = hasCoordinates ? Number(latitude) : defaultCenter.lat;
      const startLng = hasCoordinates ? Number(longitude) : defaultCenter.lng;
      const zoom = hasCoordinates ? 15 : 11;

      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (event) => {
        const { lat, lng } = event.latlng;
        setMarkerPosition(lat, lng);
        onCoordinatesChange(lat, lng);
      });

      mapRef.current = map;
      setMapReady(true);

      if (hasCoordinates) {
        setMarkerPosition(startLat, startLng, { moveMap: false });
      }

      window.setTimeout(() => {
        map.invalidateSize();
      }, 120);
    }

    void initMap();

    return () => {
      active = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        leafletRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapReady || !isValidCoordinates(latitude, longitude)) {
      return;
    }

    setMarkerPosition(Number(latitude), Number(longitude));
  }, [latitude, longitude, mapReady, setMarkerPosition]);

  async function handleFindFromAddress() {
    try {
      setSearching(true);
      setLinkError("");
      const result = await geocodeAddress(address);
      onCoordinatesChange(result.lat, result.lng);
    } catch (findError) {
      setLinkError(findError.message || "Unable to locate this address.");
    } finally {
      setSearching(false);
    }
  }

  function handleApplyMapsLink() {
    const parsed = parseGoogleMapsUrl(mapsLink);
    if (!parsed) {
      setLinkError("Paste a valid Google Maps link with coordinates.");
      return;
    }

    setLinkError("");
    onCoordinatesChange(parsed.lat, parsed.lng);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand/10 bg-brand-light/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <MapPin className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-ink">Pin exact location on map</p>
            <p className="mt-1 text-xs leading-5 text-brand-muted">
              Search by address, paste a Google Maps link, or click the map to drop the pin.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleFindFromAddress}
            disabled={searching || !address.trim()}
          >
            {searching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" strokeWidth={2.25} />
                Find from address
              </>
            )}
          </Button>
        </div>

        <div className="mt-4">
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-brand-muted">
            Google Maps link
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input
              value={mapsLink}
              onChange={(event) => {
                setMapsLink(event.target.value);
                if (linkError) setLinkError("");
              }}
              placeholder="Paste maps.app.goo.gl or google.com/maps link"
              className="flex-1"
            />
            <Button type="button" variant="accent" className="w-full sm:w-auto" onClick={handleApplyMapsLink}>
              <Link2 className="mr-2 h-4 w-4" strokeWidth={2.25} />
              Apply link
            </Button>
          </div>
        </div>

        {linkError ? <p className="mt-2 text-xs font-medium text-rose-600">{linkError}</p> : null}
        {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}

        {hasCoordinates ? (
          <p className="mt-3 text-xs font-medium text-brand-dark">
            Selected pin: {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
          </p>
        ) : (
          <p className="mt-3 text-xs text-brand-muted">No pin selected yet.</p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 ring-1 ring-brand/10">
        <div ref={mapContainerRef} className="h-[320px] w-full bg-brand-light/40 sm:h-[360px]" />
      </div>
    </div>
  );
}
