import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

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
    const trimmedName = name.trim();
    const normalizedPhone = normalizePhone(phone);
    const normalizedPassword = password;

    if (!trimmedName) {
      nextErrors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }

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

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (normalizedPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSignup(event) {
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

      const response = await API.post("/auth/signup", {
        name: name.trim(),
        phone: normalizePhone(phone),
        password,
      });

      if (!response.data?.token || !response.data?.user) {
        throw new Error("Signup response was missing session data.");
      }

      saveSession({
        token: response.data.token,
        user: response.data.user,
      });

      setStatus({
        tone: "success",
        message: "Account created successfully! Redirecting to your dashboard...",
      });
      setToast({ message: "Signup successful!", tone: "success" });

      window.setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to create account. Please try again.";

      setStatus({ tone: "error", message });
      setToast({ message, tone: "error" });

      if (message.toLowerCase().includes("already")) {
        setErrors((current) => ({
          ...current,
          phone: "This phone number is already registered",
        }));
      }
    } finally {
      setLoading(false);
    }
  }

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
        <div className="rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.96))] p-8 text-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.5)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-300">
            Why sign up?
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Unlock all premium features
          </h2>

          <ul className="mt-6 space-y-4 text-sm text-slate-300">
            <li>Create your secure buyer or seller account in seconds.</li>
            <li>Publish properties and manage them from one dashboard.</li>
            <li>Keep your identity tied to your phone-based login.</li>
            <li>Start with a user role while admin access stays backend controlled.</li>
          </ul>
        </div>

        <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
          <form onSubmit={handleSignup} className="space-y-5">
            <StatusBanner tone={status.tone} message={status.message} />

            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="signup-name">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="signup-name"
                placeholder="John Doe"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) {
                    setErrors((current) => ({ ...current, name: "" }));
                  }
                }}
                disabled={loading}
                className={
                  errors.name
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
                    : ""
                }
              />
              <ErrorMessage message={errors.name} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="signup-phone">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <Input
                id="signup-phone"
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
                htmlFor="signup-password"
              >
                Password <span className="text-rose-500">*</span>
              </label>
              <Input
                id="signup-password"
                placeholder="Minimum 6 characters"
                type="password"
                autoComplete="new-password"
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

            <div>
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="signup-confirm-password"
              >
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <Input
                id="signup-confirm-password"
                placeholder="Repeat your password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (errors.confirmPassword) {
                    setErrors((current) => ({ ...current, confirmPassword: "" }));
                  }
                }}
                disabled={loading}
                className={
                  errors.confirmPassword
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
                    : ""
                }
              />
              <ErrorMessage message={errors.confirmPassword} />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
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
