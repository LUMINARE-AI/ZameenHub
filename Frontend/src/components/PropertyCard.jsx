import React from "react";

const PropertyCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition duration-300 cursor-pointer"></div>
  <div className="relative">
    <img
      className="w-full h-48 object-cover"
      src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
    />
    <span className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 text-sm rounded">
      Featured
    </span>
  </div>

  <div className="p-4">
    <h3 className="text-xl font-bold text-blue-600">₹45,00,000</h3>
    <p className="text-gray-700 mt-1">2BHK Flat in Jaipur</p>
    <p className="text-sm text-gray-500 mt-1">1200 sqft</p>
  </div>

</div>
  );
};

export default PropertyCard;