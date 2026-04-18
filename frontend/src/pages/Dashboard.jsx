import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/dashboard/my-properties", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setData(res.data));
  }, []);

 return (
  <div className="max-w-5xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">My Properties</h1>

    <div className="space-y-4">
      {data.map((p) => (
        <div key={p._id} className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">{p.title}</h2>
          <p>{p.location}</p>
        </div>
      ))}
    </div>
  </div>
);
}