"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Camera, Check, Loader2, Star } from "lucide-react";
import API from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusBanner from "@/components/StatusBanner";
import Toast from "@/components/ui/Toast";
import { formatPrice, PROPERTY_CATEGORIES } from "@/lib/property";
import { isValidCoordinates } from "@/lib/maps";
import dynamic from "next/dynamic";

const LocationMapPicker = dynamic(() => import("@/components/LocationMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-brand-light/30 text-sm text-brand-muted">
      Loading map...
    </div>
  ),
});

const STEPS = [
  { id: 1, label: "Basic info" },
  { id: 2, label: "Details" },
  { id: 3, label: "Photo" },
  { id: 4, label: "Review" },
];

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
      {message}
    </p>
  );
}

export default function AddPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Plots");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [configuration, setConfiguration] = useState("2BHK");
  const [floorNumber, setFloorNumber] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [facing, setFacing] = useState("");
  const [overlooking, setOverlooking] = useState("");
  const [propertyAge, setPropertyAge] = useState("");
  const [pricePerSqFt, setPricePerSqFt] = useState("");
  const [highlights, setHighlights] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ tone: "", message: "" });
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const [errors, setErrors] = useState({});

  function showToast(message, tone = "info") {
    setToast({ message, tone });
    window.setTimeout(() => setToast({ message: "", tone: "info" }), 4000);
  }

  function validateStep(currentStep) {
    const newErrors = {};
    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);

    if (currentStep === 1) {
      if (!trimmedTitle) newErrors.title = "Property title is required";
      else if (trimmedTitle.length < 5) newErrors.title = "Title must be at least 5 characters";

      if (!trimmedLocation) newErrors.location = "Location is required";
      else if (trimmedLocation.length < 3) newErrors.location = "Location must be at least 3 characters";

      if (!isValidCoordinates(latitude, longitude)) {
        newErrors.mapLocation = "Pin the exact property location on the map";
      }

      if (!trimmedDescription) newErrors.description = "Description is required";
      else if (trimmedDescription.length < 20) newErrors.description = "Description must be at least 20 characters";

      if (!price) newErrors.price = "Price is required";
      else if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) newErrors.price = "Price must be a valid positive number";
    }

    if (currentStep === 3) {
      if (!image) newErrors.image = "Property image is required";
      else if (!image.type.startsWith("image/")) newErrors.image = "Upload a valid image file";
      else if (image.size > 5 * 1024 * 1024) newErrors.image = "Image must be 5MB or smaller";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateForm() {
    return validateStep(1) && validateStep(3);
  }

  function goNext() {
    if (validateStep(step)) {
      setStep((current) => Math.min(current + 1, STEPS.length));
    }
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  function handleCoordinatesChange(lat, lng) {
    setLatitude(lat);
    setLongitude(lng);
    if (errors.mapLocation) {
      setErrors((current) => ({ ...current, mapLocation: "" }));
    }
  }

  const submit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setStatus({ tone: "error", message: "Please fix the errors below before submitting." });
      showToast("Please fix the form errors", "error");
      return;
    }

    try {
      setLoading(true);
      setStatus({ tone: "", message: "" });
      setErrors({});

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("price", Number(price));
      formData.append("location", location.trim());
      formData.append("latitude", String(latitude));
      formData.append("longitude", String(longitude));
      formData.append("description", description.trim());
      formData.append("carpetArea", carpetArea ? Number(carpetArea) : "");
      formData.append("configuration", configuration);
      formData.append("floorNumber", floorNumber ? Number(floorNumber) : "");
      formData.append("totalFloors", totalFloors ? Number(totalFloors) : "");
      formData.append("facing", facing);
      formData.append("overlooking", overlooking);
      formData.append("propertyAge", propertyAge);
      formData.append("pricePerSqFt", pricePerSqFt ? Number(pricePerSqFt) : "");
      formData.append("highlights", highlights);
      if (image) formData.append("image", image);

      await API.post("/properties", formData);

      setStatus({
        tone: "success",
        message: "Your listing has been submitted and is pending approval. Check your dashboard to monitor status.",
      });
      showToast("Property submitted successfully!", "success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to submit the listing. Please try again.";
      setStatus({ tone: "error", message });
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImage(null);
        setImagePreview(null);
        setErrors((current) => ({ ...current, image: "Upload a valid image file" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setImage(null);
        setImagePreview(null);
        setErrors((current) => ({ ...current, image: "Image must be 5MB or smaller" }));
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setErrors((current) => ({ ...current, image: "" }));
    }
  }

  const selectClass =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">List your plot or property</p>
        <h1 className="font-display mt-1 text-xl font-extrabold text-brand-ink sm:text-2xl">
          Sell land, plots and commercial spaces on Asli Patta
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          Complete each step below. Your property will be reviewed and published once approved.
        </p>

        <div className="mt-6 flex items-center gap-2">
          {STEPS.map((item, index) => (
            <div key={item.id} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                  step > item.id
                    ? "bg-brand text-white"
                    : step === item.id
                      ? "bg-brand-accent text-white"
                      : "bg-brand-light text-brand-muted"
                }`}
              >
                {step > item.id ? <Check className="h-4 w-4" strokeWidth={3} /> : item.id}
              </div>
              <span
                className={`hidden text-xs font-semibold sm:block ${
                  step >= item.id ? "text-brand-ink" : "text-brand-muted"
                }`}
              >
                {item.label}
              </span>
              {index < STEPS.length - 1 ? (
                <div className={`mx-1 h-0.5 flex-1 rounded ${step > item.id ? "bg-brand" : "bg-brand-light"}`} />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <StatusBanner tone={status.tone} message={status.message} />

      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-brand-ink">
                Listing Title <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g., 120 sq yd plot near main road"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                className={`mt-1 ${errors.title ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}`}
              />
              <ErrorMessage message={errors.title} />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-ink">
                Category <span className="text-rose-500">*</span>
              </label>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}>
                {PROPERTY_CATEGORIES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-ink">
                Price (in ₹) <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g., 2500000"
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors({ ...errors, price: "" });
                }}
                className={`mt-1 ${errors.price ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}`}
              />
              <ErrorMessage message={errors.price} />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-ink">
                Location <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g., Sector 10, Noida"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors({ ...errors, location: "" });
                }}
                className={`mt-1 ${errors.location ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}`}
              />
              <ErrorMessage message={errors.location} />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-ink">
                Map location <span className="text-rose-500">*</span>
              </label>
              <div className="mt-2">
                <LocationMapPicker
                  latitude={latitude}
                  longitude={longitude}
                  onCoordinatesChange={handleCoordinatesChange}
                  address={location}
                  error={errors.mapLocation}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-ink">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                placeholder="Describe access road, plot size, nearby landmarks, approvals..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                rows="4"
                className={`mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15 ${
                  errors.description ? "border-rose-500" : "border-slate-200"
                }`}
              />
              <ErrorMessage message={errors.description} />
              <p className="mt-1 text-xs text-brand-muted">{description.length} characters</p>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-brand-ink">Optional listing details</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-brand-muted">Carpet area (sq.ft)</label>
                <Input type="number" placeholder="e.g., 1200" value={carpetArea} onChange={(e) => setCarpetArea(e.target.value)} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-muted">Configuration</label>
                <Input placeholder="e.g., 2BHK" value={configuration} onChange={(e) => setConfiguration(e.target.value)} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-muted">Floor number</label>
                <Input type="number" placeholder="e.g., 2" value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-muted">Total floors</label>
                <Input type="number" placeholder="e.g., 5" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-muted">Facing</label>
                <Input placeholder="East, West, North" value={facing} onChange={(e) => setFacing(e.target.value)} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-muted">Overlooking</label>
                <Input placeholder="Road, Park, Garden" value={overlooking} onChange={(e) => setOverlooking(e.target.value)} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-muted">Property age</label>
                <Input placeholder="e.g., 5 years" value={propertyAge} onChange={(e) => setPropertyAge(e.target.value)} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-muted">Price per sq.ft</label>
                <Input type="number" placeholder="Optional" value={pricePerSqFt} onChange={(e) => setPricePerSqFt(e.target.value)} className="mt-2" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-brand-muted">Highlights</label>
              <textarea
                rows="2"
                placeholder="Add 3-4 selling highlights separated by commas"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <label className="text-sm font-semibold text-brand-ink">
              Plot / Property Image <span className="text-rose-500">*</span>
            </label>
            <div
              className={`mt-2 flex min-h-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
                errors.image
                  ? "border-rose-500 bg-rose-50"
                  : imagePreview
                    ? "border-brand bg-brand-light/30"
                    : "border-slate-300 bg-brand-light/20 hover:border-brand hover:bg-brand-light/40"
              }`}
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="p-6 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Camera className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-medium text-brand-ink">Click to upload land or property image</p>
                  <p className="mt-1 text-xs text-brand-muted">JPG or PNG up to 5MB</p>
                </div>
              )}
            </div>
            <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <ErrorMessage message={errors.image} />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-brand-ink">Review your listing</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              ) : null}
              <div className="space-y-3 rounded-2xl bg-brand-light/40 p-4 ring-1 ring-brand/10">
                <div>
                  <p className="text-xs font-bold uppercase text-brand-muted">Title</p>
                  <p className="mt-1 font-semibold text-brand-ink">{title}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-brand-muted">Price</p>
                  <p className="mt-1 font-display text-xl font-bold text-brand-dark">{formatPrice(Number(price))}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-brand-muted">Location</p>
                  <p className="mt-1 text-sm text-brand-ink">{location}</p>
                  {isValidCoordinates(latitude, longitude) ? (
                    <p className="mt-1 text-xs text-brand-muted">
                      Pin: {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-brand-muted">Category</p>
                  <p className="mt-1 text-sm text-brand-ink">{category}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-brand-muted">Description</p>
                  <p className="mt-1 line-clamp-3 text-sm text-brand-muted">{description}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={goBack} disabled={loading}>
                Back
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>

          {step < STEPS.length ? (
            <Button type="button" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                  Submitting...
                </span>
              ) : (
                "Submit Property"
              )}
            </Button>
          )}
        </div>
      </form>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Before you list</p>
          <ul className="mt-4 space-y-3 text-sm text-brand-muted">
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
              <span>Make sure all fields are accurate and complete</span>
            </li>
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
              <span>Upload a clear plot, land, shop or property image</span>
            </li>
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
              <span>Your listing will be reviewed within 24 hours</span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Listing gets more visibility when</p>
          <ul className="mt-4 space-y-3 text-sm text-brand-muted">
            <li className="flex gap-3">
              <Star className="mt-0.5 h-4 w-4 shrink-0 fill-brand-accent text-brand-accent" strokeWidth={2} />
              <span>Your property details are complete and accurate</span>
            </li>
            <li className="flex gap-3">
              <Star className="mt-0.5 h-4 w-4 shrink-0 fill-brand-accent text-brand-accent" strokeWidth={2} />
              <span>You respond quickly to buyer inquiries</span>
            </li>
            <li className="flex gap-3">
              <Star className="mt-0.5 h-4 w-4 shrink-0 fill-brand-accent text-brand-accent" strokeWidth={2} />
              <span>Your property is in high-demand locations</span>
            </li>
          </ul>
        </div>
      </section>

      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
