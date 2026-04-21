import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import API from "../services/api";
import { formatPrice } from "../utils/property";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);

  async function fetchMyProperties() {
    try {
      const response = await API.get("/dashboard/my-properties");
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      try {
        const response = await API.get("/dashboard/my-properties");

        if (active) {
          setProperties(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.log(error);
      }
    }

    void loadProperties();

    return () => {
      active = false;
    };
  }, []);

  async function deleteProperty(id) {
    try {
      await API.delete(`/properties/${id}`);
      await fetchMyProperties();
    } catch (error) {
      console.log(error);
    }
  }

  async function editProperty(property) {
    const newTitle = prompt("Enter new title", property.title);

    if (!newTitle) {
      return;
    }

    try {
      await API.put(`/properties/${property._id}`, { title: newTitle });
      await fetchMyProperties();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">My listed properties</h1>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center md:col-span-2 xl:col-span-3">
            <p className="text-xl font-semibold text-slate-900">No properties added yet</p>
            <p className="mt-2 text-sm text-slate-500">Your listings will appear here once published.</p>
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
              <p className="mt-4 text-sm leading-6 text-slate-600">{property.description}</p>

              <div className="mt-6 flex gap-3">
                <Button variant="ghost" onClick={() => editProperty(property)}>
                  Edit
                </Button>
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
