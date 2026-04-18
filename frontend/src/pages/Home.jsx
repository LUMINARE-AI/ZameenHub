import { useEffect, useState } from "react";
import API from "../services/api";
import PropertyCard from "../components/PropertyCard";

export default function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    API.get("/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.log(err));
  }, []);

return (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Find Your Dream Property</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p._id} property={p} />
      ))}
    </div>
  </div>
);
}