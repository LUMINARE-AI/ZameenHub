import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import AddProperty from "./pages/AddProperty";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PropertyDetail from "./pages/PropertyDetail";
import InfoPage from "./pages/InfoPage";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_32%,_#f8fafc_100%)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle,_rgba(14,165,233,0.14),_transparent_55%)]" />
        <BrowserRouter>
          <Navbar />
          <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1440px] flex-col px-3 pb-6 pt-4 sm:px-4 lg:px-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buy-plots" element={<Listings defaultCategory="plots" />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/property/:propertyId" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<InfoPage type="about" />} />
              <Route path="/contact" element={<InfoPage type="contact" />} />
              <Route path="/terms" element={<InfoPage type="terms" />} />
              <Route path="/privacy" element={<InfoPage type="privacy" />} />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default AppLayout;
