import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-2xl font-bold text-blue-600">ZameenHub</h1>

      {/* Desktop */}
      <div className="hidden md:flex gap-6">
        <a href="/" className="hover:text-blue-500">Buy</a>
        <a href="/add" className="hover:text-blue-500">Sell</a>
        <a href="/dashboard" className="hover:text-blue-500">Dashboard</a>
        <a href="/admin" className="hover:text-blue-500">Admin</a>
      </div>

      {/* Mobile Button */}
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          <a href="/">Buy</a>
          <a href="/add">Sell</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/admin">Admin</a>
        </div>
      )}
    </nav>
  );
}