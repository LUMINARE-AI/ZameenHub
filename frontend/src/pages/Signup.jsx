import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveSession } from "../utils/auth";
import API from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StatusBanner from "../components/StatusBanner";
import Toast from "../components/ui/Toast";

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
      <span>⚠</span> {message}
    </p>
  );
}

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const [errors, setErrors] = useState({});

  function showToast(message, tone = "info") {
    setToast({ message, tone });
    window.setTimeout(() => setToast({ message: "", tone: "info" }), 4000);
  }

  function validateForm() {
    const newErrors = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    // Name validation
    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Phone validation
    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(trimmedPhone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone must be at least 10 digits";
    }

    // Password validation
    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    } else if (trimmedPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (trimmedPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus({
        tone: "error",
        message: "Please fix the errors below before continuing.",
      });
      showToast("Please fix the form errors", "error");
      return;
    }

    try {
      setLoading(true);
      setStatus({ tone: "", message: "" });
      setErrors({});

      const response = await API.post("/auth/signup", {
        name: name.trim(),
        phone: phone.trim(),
        password: password.trim(),
      });

      setStatus({
        tone: "success",
        message: "Account created successfully! Redirecting...",
      });
      showToast("Signup successful!", "success");

      // Save session
      saveSession({
        token: response.data.token,
        user: response.data.user,
      });

      // Redirect after brief delay
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to create account. Please try again.";
      setStatus({ tone: "error", message });
      showToast(message, "error");

      // Handle specific error for duplicate phone
      if (error.response?.data?.message?.includes("already")) {
        setErrors({ phone: "This phone number is already registered" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">
          Create account
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Join ZameenHub
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign up to buy, sell, or rent properties on our platform.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT SIDE - INFO */}
        <div className="rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.96))] p-8 text-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.5)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-300">
            Why sign up?
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Unlock all premium features
          </h2>

          <ul className="mt-6 space-y-4">
            <li className="flex gap-3">
              <span className="text-xl">🏠</span>
              <div>
                <p className="font-semibold">List Properties</p>
                <p className="text-sm text-slate-300">
                  Sell or rent your properties to millions of buyers
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">❤️</span>
              <div>
                <p className="font-semibold">Save Favorites</p>
                <p className="text-sm text-slate-300">
                  Save and organize your favorite listings
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">🔔</span>
              <div>
                <p className="font-semibold">Get Notifications</p>
                <p className="text-sm text-slate-300">
                  Receive alerts for new listings matching your criteria
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">💬</span>
              <div>
                <p className="font-semibold">Direct Messaging</p>
                <p className="text-sm text-slate-300">
                  Connect directly with buyers and sellers
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
          <form onSubmit={handleSignup} className="space-y-5">
            <StatusBanner tone={status.tone} message={status.message} />

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                disabled={loading}
                className={errors.name ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}
              />
              <ErrorMessage message={errors.name} />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="9876543210"
                type="tel"
                value={phone}
                onChange={(e) => {
                  // Only allow digits
                  const cleaned = e.target.value.replace(/\D/g, "");
                  setPhone(cleaned);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                disabled={loading}
                className={errors.phone ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}
              />
              <ErrorMessage message={errors.phone} />
              <p className="mt-1 text-xs text-slate-400">
                {phone.length} digits
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                disabled={loading}
                className={errors.password ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}
              />
              <ErrorMessage message={errors.password} />
              <p className="mt-1 text-xs text-slate-400">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
                disabled={loading}
                className={errors.confirmPassword ? "border-rose-500 focus:ring-rose-100 focus:border-rose-500" : ""}
              />
              <ErrorMessage message={errors.confirmPassword} />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⟳</span>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </section>

      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
