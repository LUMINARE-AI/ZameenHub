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

    <h1 className="text-4xl font-bold mb-8 text-center">
      Find Your Dream Property
    </h1>

    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {properties.map((p) => (
        <PropertyCard key={p._id} property={p} />
      ))}
    </div>

  </div>
);
}