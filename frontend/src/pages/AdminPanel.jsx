import { useEffect, useState } from "react";
import StatusBanner from "../components/StatusBanner";
import Button from "../components/ui/Button";
import API from "../services/api";
import { formatPrice } from "../utils/property";

export default function AdminPanel() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ tone: "info", message: "" });

  async function fetchPending() {
    try {
      setLoading(true);
      const response = await API.get("/admin/properties/pending");
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to load pending properties.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadPending() {
      try {
        setLoading(true);
        const response = await API.get("/admin/properties/pending");

        if (active) {
          setProperties(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.log(error);

        if (active) {
          setStatus({
            tone: "error",
            message: error.response?.data?.message || "Unable to load pending properties.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPending();

    return () => {
      active = false;
    };
  }, []);

  async function approve(id) {
    try {
      await API.put(`/admin/properties/${id}/approve`, {});
      setStatus({ tone: "success", message: "Property approved successfully." });
      await fetchPending();
    } catch (error) {
      console.log(error);
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Approval failed.",
      });
    }
  }

  async function deleteProperty(id) {
    try {
      await API.delete(`/admin/properties/${id}`);
      setStatus({ tone: "success", message: "Property deleted successfully." });
      await fetchPending();
    } catch (error) {
      console.log(error);
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Delete failed.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">
          Admin panel
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Pending property approvals
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Review incoming listings before they appear publicly.
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
            <p className="text-xl font-semibold text-slate-900">No pending properties</p>
            <p className="mt-2 text-sm text-slate-500">
              New submissions will show up here for review.
            </p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property._id}
              className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.26)]"
            >
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Pending
              </span>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">{property.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{property.location}</p>
              <p className="mt-4 text-2xl font-semibold text-slate-950">
                {formatPrice(property.price)}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{property.description}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Owner: {property.owner?.name || "Unknown"}
                {property.owner?.phone ? ` • ${property.owner.phone}` : ""}
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={() => approve(property._id)}>Approve</Button>
                <Button variant="dark" onClick={() => deleteProperty(property._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
