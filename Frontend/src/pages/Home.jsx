import React from "react";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  return (
    <div className="relative h-[70vh] flex items-center justify-center">
      <div className="absolute w-full h-full bg-gradient-to-r from-black/60 to-black/30"></div>
  {/* Background Image */}
  <img 
    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
    className="absolute w-full h-full object-cover"
  />

  {/* Overlay */}
  <div className="absolute w-full h-full bg-black/50"></div>

  {/* Content */}
  <div className="relative text-center text-white">
    <h1 className="text-4xl md:text-6xl font-bold">
      Find Your Dream Home
    </h1>
    <p className="mt-3 text-lg">
      Buy, Sell & Rent Properties Easily
    </p>

    {/* Search Box */}
    <div className="mt-6 flex bg-white rounded-lg overflow-hidden shadow-lg">
      <input 
        type="text"
        placeholder="Search location..."
        className="px-4 py-3 w-64 text-black outline-none"
      />
      <button className="bg-blue-600 px-6 text-white">
        Search
      </button>
    </div>
  </div>
</div>
  );
};

export default Home;