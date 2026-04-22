import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StatusBanner from "../components/StatusBanner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import API from "../services/api";
import { formatPrice } from "../utils/property";

export default function Dashboard() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(location.state?.status || { tone: "info", message: "" });
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
  });

  async function fetchMyProperties() {
    try {
      setLoading(true);
      const response = await API.get("/dashboard/my-properties");
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to load your properties.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      try {
        setLoading(true);
        const response = await API.get("/dashboard/my-properties");

        if (active) {
          setProperties(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.log(error);

        if (active) {
          setStatus({
            tone: "error",
            message: error.response?.data?.message || "Unable to load your properties.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProperties();

    return () => {
      active = false;
    };
  }, []);

  function startEditing(property) {
    setEditingId(property._id);
    setDraft({
      title: property.title || "",
      location: property.location || "",
      price: property.price || "",
      description: property.description || "",
    });
  }

  function stopEditing() {
    setEditingId(null);
    setDraft({ title: "", location: "", price: "", description: "" });
  }

  async function saveProperty(id) {
    try {
      await API.put(`/properties/${id}`, {
        title: draft.title.trim(),
        location: draft.location.trim(),
        price: Number(draft.price),
        description: draft.description.trim(),
      });
      setStatus({ tone: "success", message: "Property updated successfully." });
      stopEditing();
      await fetchMyProperties();
    } catch (error) {
      console.log(error);
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to update the property.",
      });
    }
  }

  async function deleteProperty(id) {
    try {
      await API.delete(`/properties/${id}`);
      setStatus({ tone: "success", message: "Property deleted successfully." });
      await fetchMyProperties();
    } catch (error) {
      console.log(error);
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to delete the property.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">My listed properties</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review status, update details, and manage your live submissions.
        </p>
      </section>

      <StatusBanner tone={status.tone} message={status.message} />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-[32px] border border-white/70 bg-white/90"
            />
          ))
        ) : properties.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center md:col-span-2 xl:col-span-3">
            <p className="text-xl font-semibold text-slate-900">No properties added yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Your listings will appear here once published.
            </p>
          </div>
        ) : (
          properties.map((property) => {
            const isEditing = editingId === property._id;

            return (
              <div
                key={property._id}
                className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.26)]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      property.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {property.status || "pending"}
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={draft.title}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, title: event.target.value }))
                      }
                    />
                    <Input
                      value={draft.location}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, location: event.target.value }))
                      }
                    />
                    <Input
                      value={draft.price}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, price: event.target.value }))
                      }
                    />
                    <textarea
                      value={draft.description}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, description: event.target.value }))
                      }
                      rows="4"
                      className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <div className="flex gap-3">
                      <Button onClick={() => saveProperty(property._id)}>Save</Button>
                      <Button variant="ghost" onClick={stopEditing}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-slate-950">{property.title}</h2>
                    <p className="mt-2 text-sm text-slate-500">{property.location}</p>
                    <p className="mt-4 text-2xl font-semibold text-slate-950">
                      {formatPrice(property.price)}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{property.description}</p>

                    <div className="mt-6 flex gap-3">
                      <Button variant="ghost" onClick={() => startEditing(property)}>
                        Edit
                      </Button>
                      <Button variant="dark" onClick={() => deleteProperty(property._id)}>
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
