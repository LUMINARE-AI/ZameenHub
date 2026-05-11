import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/auth";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  fallbackPath = "/login",
}) {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to={fallbackPath} replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
