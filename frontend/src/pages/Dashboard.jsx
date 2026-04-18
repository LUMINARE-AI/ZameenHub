import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/dashboard/my-properties", {
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
    fetchMyProperties();
  }, []);

  // 🗑 DELETE FUNCTION
  const deleteProperty = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Deleted!");
      fetchMyProperties(); // refresh
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Properties</h1>

      {properties.length === 0 ? (
        <p>No properties added yet</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {properties.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-xl shadow">
              
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="text-gray-600">{p.location}</p>
              <p className="text-blue-600 font-bold">₹ {p.price}</p>

              <p className="text-sm mt-2">{p.description}</p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => deleteProperty(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

                {/* Future: Edit button */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}