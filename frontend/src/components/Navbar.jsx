import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <h1 className="text-2xl font-bold text-blue-600">ZameenHub</h1>

      <div className="flex gap-8 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-600">Buy</Link>
        <Link to="/add" className="hover:text-blue-600">Sell</Link>
        <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Login
        </Link>
      </div>
    </div>
  );
}