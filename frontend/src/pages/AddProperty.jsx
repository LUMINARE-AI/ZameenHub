import { useState } from "react";
import API from "../services/api";

export default function AddProperty() {
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await API.post("/properties", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Property Added!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">

  <input className="w-full border p-2 rounded" placeholder="Title"
    onChange={(e) => setForm({...form, title: e.target.value})} />

  <input className="w-full border p-2 rounded" placeholder="Price"
    onChange={(e) => setForm({...form, price: e.target.value})} />

  <input className="w-full border p-2 rounded" placeholder="Location"
    onChange={(e) => setForm({...form, location: e.target.value})} />

  <input className="w-full border p-2 rounded" placeholder="Contact"
    onChange={(e) => setForm({...form, contact: e.target.value})} />

  <textarea className="w-full border p-2 rounded" placeholder="Description"
    onChange={(e) => setForm({...form, description: e.target.value})} />

  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
    Add Property
  </button>

</form>
  );
}