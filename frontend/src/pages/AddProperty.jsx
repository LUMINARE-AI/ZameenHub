import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBanner from "../components/StatusBanner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import API from "../services/api";

export default function AddProperty() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ tone: "info", message: "" });

  async function submit() {
    if (!title.trim() || !price.trim() || !location.trim() || !description.trim()) {
      setStatus({ tone: "error", message: "Please fill all property details." });
      return;
    }

    if (Number(price) <= 0) {
      setStatus({ tone: "error", message: "Please enter a valid price." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ tone: "info", message: "" });
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("price", String(Number(price)));
      formData.append("location", location.trim());
      formData.append("description", description.trim());

      if (image) {
        formData.append("image", image);
      }

      await API.post("/properties", formData);
      navigate("/dashboard", {
        state: {
          status: {
            tone: "success",
            message: "Property added successfully and sent for approval.",
          },
        },
      });
    } catch (error) {
      console.log(error);
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Error adding property.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[36px] border border-white/70 bg-slate-950 p-8 text-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.45)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-300">
          Sell with confidence
        </p>
        <h1 className="mt-3 text-4xl font-semibold">
          Create a listing that feels premium from the first glance
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Add your property details, showcase imagery, and present your home with the
          level of polish buyers expect from top-tier real estate platforms.
        </p>
      </section>

      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <h2 className="text-2xl font-semibold text-slate-950">Add property</h2>
        <div className="mt-8 grid gap-4">
          <StatusBanner tone={status.tone} message={status.message} />

          <div>
            <label className="text-sm font-medium text-slate-600">Title</label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Price</label>
            <Input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-2"
              placeholder="e.g. 12500000"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Location</label>
            <Input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="5"
              className="mt-2 w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Hero image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
              className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500"
            />
          </div>

          <Button onClick={submit} className="mt-2 w-full" disabled={loading}>
            {loading ? "Submitting..." : "Publish listing"}
          </Button>
        </div>
      </section>
    </div>
  );
}
