import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import API from "../services/api";
import { formatPrice } from "../utils/property";

export default function AdminPanel() {
  const [properties, setProperties] = useState([]);

  async function fetchPending() {
    try {
      const response = await API.get("/admin/properties/pending");
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadPending() {
      try {
        const response = await API.get("/admin/properties/pending");

        if (active) {
          setProperties(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.log(error);
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
      await fetchPending();
    } catch (error) {
      console.log(error);
      alert("Approval failed");
    }
  }

  async function deleteProperty(id) {
    try {
      await API.delete(`/admin/properties/${id}`);
      await fetchPending();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Admin panel</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Pending property approvals</h1>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center md:col-span-2 xl:col-span-3">
            <p className="text-xl font-semibold text-slate-900">No pending properties</p>
            <p className="mt-2 text-sm text-slate-500">New submissions will show up here for review.</p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property._id}
              className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.26)]"
            >
              <h2 className="text-xl font-semibold text-slate-950">{property.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{property.location}</p>
              <p className="mt-4 text-2xl font-semibold text-slate-950">{formatPrice(property.price)}</p>
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
