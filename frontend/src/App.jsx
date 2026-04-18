import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddProperty from "./pages/AddProperty";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "/pages/AdminPanel";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add" element={<AddProperty />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/add" element={<AddProperty />} />
      </Routes>
    </BrowserRouter>
  );
}