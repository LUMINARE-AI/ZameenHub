import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StatusBanner from "../components/StatusBanner";
import Toast from "../components/ui/Toast";
import { PROPERTY_CATEGORIES } from "../utils/property";
import { getStoredToken } from "../utils/auth";

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-xs text-rose-600 font-medium flex items-center gap-1">
      <span>⚠</span> {message}
    </p>
  );
}

export default function AddProperty() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Plots");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
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

  function validateForm() {
    const newErrors = {};
    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);

    if (!trimmedTitle) {
      newErrors.title = "Property title is required";
    } else if (trimmedTitle.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!trimmedLocation) {
      newErrors.location = "Location is required";
    } else if (trimmedLocation.length < 3) {
      newErrors.location = "Location must be at least 3 characters";
    }

    if (!trimmedDescription) {
      newErrors.description = "Description is required";
    } else if (trimmedDescription.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!price) {
      newErrors.price = "Price is required";
    } else if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!image) {
      newErrors.image = "Property image is required";
    } else if (!image.type.startsWith("image/")) {
      newErrors.image = "Upload a valid image file";
    } else if (image.size > 5 * 1024 * 1024) {
      newErrors.image = "Image must be 5MB or smaller";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const submit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setStatus({
        tone: "error",
        message: "Please fix the errors below before submitting.",
      });
      showToast("Please fix the form errors", "error");
      return;
    }

    if (!getStoredToken()) {
      setStatus({ tone: "error", message: "Login is required to list a property." });
      showToast("Login required.", "error");
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
      if (image) {
        formData.append("image", image);
      }

      await API.post("/properties", formData);

      setStatus({
        tone: "success",
        message: "Your listing has been submitted and is pending approval. Check your dashboard to monitor status.",
      });
      showToast("Property submitted successfully!", "success");
      
      setTimeout(() => navigate("/dashboard"), 1500);
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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((current) => ({ ...current, image: "" }));
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          List your plot or property
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">
          Sell land, plots and commercial spaces on ZameenHub
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Fill in the details below. Your property will be reviewed and published once approved.
        </p>
      </section>

      <StatusBanner tone={status.tone} message={status.message} />

      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px]">
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Listing Title <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g., 120 sq yd plot near main road"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                className={errors.title ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}
              />
              <ErrorMessage message={errors.title} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {PROPERTY_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
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
                className={errors.price ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}
              />
              <ErrorMessage message={errors.price} />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Location <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g., Sector 10, Noida"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors({ ...errors, location: "" });
                }}
                className={errors.location ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}
              />
              <ErrorMessage message={errors.location} />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
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
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                  errors.description ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : "border-slate-200"
                }`}
              />
              <ErrorMessage message={errors.description} />
              <p className="mt-1 text-xs text-slate-400">
                {description.length} characters
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Listing details</p>
              <div className="mt-3 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Carpet area (sq.ft)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 1200"
                      value={carpetArea}
                      onChange={(e) => setCarpetArea(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Configuration</label>
                    <Input
                      placeholder="e.g., 2BHK"
                      value={configuration}
                      onChange={(e) => setConfiguration(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Floor number</label>
                    <Input
                      type="number"
                      placeholder="e.g., 2"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Total floors</label>
                    <Input
                      type="number"
                      placeholder="e.g., 5"
                      value={totalFloors}
                      onChange={(e) => setTotalFloors(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Facing</label>
                    <Input
                      placeholder="East, West, North"
                      value={facing}
                      onChange={(e) => setFacing(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Overlooking</label>
                    <Input
                      placeholder="Road, Park, Garden"
                      value={overlooking}
                      onChange={(e) => setOverlooking(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Property age</label>
                    <Input
                      placeholder="e.g., 5 years"
                      value={propertyAge}
                      onChange={(e) => setPropertyAge(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Price per sq.ft</label>
                    <Input
                      type="number"
                      placeholder="Optional"
                      value={pricePerSqFt}
                      onChange={(e) => setPricePerSqFt(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Highlights</label>
                  <textarea
                    rows="2"
                    placeholder="Add 3-4 selling highlights separated by commas"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4 flex flex-col">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Plot / Property Image <span className="text-rose-500">*</span>
              </label>
              <div
                className={`mt-2 rounded-2xl border-2 border-dashed transition cursor-pointer flex items-center justify-center min-h-[220px] overflow-hidden lg:min-h-[300px] ${
                  errors.image
                    ? "border-rose-500 bg-rose-50"
                    : imagePreview
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onClick={() => document.getElementById("imageInput")?.click()}
              >
                {imagePreview ? (
                  <div className="w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-sm font-medium text-slate-700">
                      Click to upload land or property image
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      JPG or PNG up to 5MB
                    </p>
                  </div>
                )}
              </div>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <ErrorMessage message={errors.image} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block animate-spin">⟳</span>
                Submitting...
              </span>
            ) : (
              "Submit Property"
            )}
          </Button>
        </div>
      </form>

      {/* Info Cards */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Before you list
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="text-base">✓</span>
              <span>Make sure all fields are accurate and complete</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base">✓</span>
              <span>Upload a clear plot, land, shop or property image</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base">✓</span>
              <span>Your listing will be reviewed within 24 hours</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Listing gets more visibility when
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="text-base">⭐</span>
              <span>Your property details are complete and accurate</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base">⭐</span>
              <span>You respond quickly to buyer inquiries</span>
            </li>
            <li className="flex gap-3">
              <span className="text-base">⭐</span>
              <span>Your property is in high-demand locations</span>
            </li>
          </ul>
        </div>
      </section>

      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
