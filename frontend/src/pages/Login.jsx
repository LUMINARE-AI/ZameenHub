import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StatusBanner from "../components/StatusBanner";
import Toast from "../components/ui/Toast";
import API from "../services/api";
import { isLoggedIn, saveSession } from "../utils/auth";

function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs font-medium text-rose-600">{message}</p>;
}

function normalizePhone(value) {
  return value.replace(/\D/g, "");
}

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = useMemo(
    () => location.state?.from || "/dashboard",
    [location.state]
  );

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  useEffect(() => {
    if (!toast.message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast({ message: "", tone: "info" });
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [toast.message]);

  function validateForm() {
    const nextErrors = {};
    const normalizedPhone = normalizePhone(phone);
    const normalizedPassword = password;

    if (!normalizedPhone) {
      nextErrors.phone = "Phone number is required";
    } else if (normalizedPhone.length < 10) {
      nextErrors.phone = "Phone must be at least 10 digits";
    }

    if (!normalizedPassword) {
      nextErrors.password = "Password is required";
    } else if (normalizedPassword.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleLogin(event) {
    event.preventDefault();

    if (!validateForm()) {
      setStatus({
        tone: "error",
        message: "Please fix the errors below before continuing.",
      });
      setToast({ message: "Please fix the form errors", tone: "error" });
      return;
    }

    try {
      setLoading(true);
      setStatus({ tone: "", message: "" });
      setErrors({});

      const response = await API.post("/auth/login", {
        phone: normalizePhone(phone),
        password,
      });

      if (!response.data?.token || !response.data?.user) {
        throw new Error("Login response was missing session data.");
      }

      saveSession({
        token: response.data.token,
        user: response.data.user,
      });

      setStatus({
        tone: "success",
        message: "Login successful! Redirecting to your dashboard...",
      });
      setToast({ message: "Welcome back to ZameenHub!", tone: "success" });

      window.setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed. Please try again.";

      setStatus({ tone: "error", message });
      setToast({ message, tone: "error" });
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Login to your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Access your dashboard, saved listings, and property management.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.96))] p-8 text-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.5)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-300">
            Your workspace
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Manage your real estate journey
          </h2>

          <ul className="mt-6 space-y-4 text-sm text-slate-300">
            <li>Track property activity from your dashboard.</li>
            <li>Manage your listings with one secure account.</li>
            <li>Access admin tools when your role allows it.</li>
            <li>Stay signed in with JWT-based protected requests.</li>
          </ul>
        </div>

        <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <StatusBanner tone={status.tone} message={status.message} />

            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="login-phone">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <Input
                id="login-phone"
                placeholder="9876543210"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(normalizePhone(event.target.value));
                  if (errors.phone) {
                    setErrors((current) => ({ ...current, phone: "" }));
                  }
                }}
                disabled={loading}
                className={
                  errors.phone
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
                    : ""
                }
              />
              <ErrorMessage message={errors.phone} />
            </div>

            <div>
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="login-password"
              >
                Password <span className="text-rose-500">*</span>
              </label>
              <Input
                id="login-password"
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password) {
                    setErrors((current) => ({ ...current, password: "" }));
                  }
                }}
                disabled={loading}
                className={
                  errors.password
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
                    : ""
                }
              />
              <ErrorMessage message={errors.password} />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Sign up here
              </Link>
            </p>
          </form>
        </div>
      </section>

      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
