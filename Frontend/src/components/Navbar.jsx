import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-4 bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50">

      <h2 className="text-2xl font-bold text-blue-600">
        ZameenHub
      </h2>

      <ul className="hidden md:flex gap-8 font-medium">
        <li className="hover:text-blue-600 cursor-pointer">Home</li>
        <li className="hover:text-blue-600 cursor-pointer">Buy</li>
        <li className="hover:text-blue-600 cursor-pointer">Rent</li>
        <li className="hover:text-blue-600 cursor-pointer">Sell</li>
      </ul>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Login
      </button>

    </nav>
  );
};

export default Navbar;