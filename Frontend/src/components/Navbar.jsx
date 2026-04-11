import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">

      <h1 className="text-xl font-semibold text-gray-800">
        ZameenHub
      </h1>

      <button className="text-sm border px-4 py-1.5 rounded-md hover:bg-gray-100">
        Login
      </button>

    </nav>
  );
};

export default Navbar;