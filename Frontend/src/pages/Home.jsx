import React from "react";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* SEARCH BAR */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-3">

          <input
            type="text"
            placeholder="Search by city, area..."
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="px-4 py-3 border rounded-lg">
            <option>Buy</option>
            <option>Rent</option>
          </select>

          <select className="px-4 py-3 border rounded-lg">
            <option>Price</option>
            <option>Below ₹50L</option>
            <option>₹50L - ₹1Cr</option>
          </select>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Search
          </button>

        </div>
      </div>

      {/* TITLE */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Properties for you
        </h2>
        <p className="text-sm text-gray-500">
          Based on your preferences
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        <PropertyCard />
        <PropertyCard />
        <PropertyCard />
        <PropertyCard />
        <PropertyCard />
        <PropertyCard />

      </div>

    </div>
  );
};

export default Home;