import React from "react";

const PropertyCard = () => {
  return (
    <div className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden cursor-pointer">

      {/* IMAGE */}
      <img
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
        className="w-full h-44 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4">

        <h3 className="text-lg font-semibold text-gray-900">
          ₹45,00,000
        </h3>

        <p className="text-sm text-gray-600 mt-1">
          2 BHK Apartment
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Vaishali Nagar, Jaipur
        </p>

        <div className="flex justify-between mt-3 text-xs text-gray-500">
          <span>1200 sqft</span>
          <span>Ready</span>
        </div>

      </div>

    </div>
  );
};

export default PropertyCard;