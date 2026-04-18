import { useEffect, useState } from "react";
import API from "./services/api";

export default function AdminPanel() {
  const [properties, setProperties] = useState([]);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/properties/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // ✅ APPROVE
  const approve = async (id) => {
    const token = localStorage.getItem("token");

    await API.put(`/admin/properties/${id}/approve`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Approved!");
    fetchPending();
  };

  // 🗑 DELETE
  const deleteProp = async (id) => {
    const token = localStorage.getItem("token");

    await API.delete(`/admin/properties/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Deleted!");
    fetchPending();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {properties.length === 0 ? (
        <p>No pending properties</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {properties.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-xl shadow">

              <h2 className="font-semibold">{p.title}</h2>
              <p>{p.location}</p>
              <p className="text-blue-600">₹ {p.price}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => approve(p._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => deleteProp(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}