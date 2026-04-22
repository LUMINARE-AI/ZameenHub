import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBanner from "../components/StatusBanner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import API from "../services/api";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectPath = useMemo(
    () => location.state?.from || "/dashboard",
    [location.state]
  );

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ tone: "info", message: "" });

  async function login() {
    const normalizedPhone = phone.trim();

    if (!normalizedPhone) {
      setStatus({ tone: "error", message: "Please enter your phone number." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ tone: "info", message: "" });

      const response = await API.post("/auth/login", {
        phone: normalizedPhone,
        name: name.trim(),
      });

      console.log("LOGIN RESPONSE:", response.data);

      // 🔥 IMPORTANT FIX
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setStatus({
        tone: "success",
        message: "Login successful. Redirecting...",
      });

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      setStatus({
        tone: "error",
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      
      {/* LEFT SIDE */}
      <section className="rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.96))] p-8 text-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.5)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-300">
          Welcome back
        </p>
        <h1 className="mt-3 text-4xl font-semibold">
          Access your buyer and seller workspace
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
          Manage saved homes, track listing activity, and stay close to every property
          conversation in one polished dashboard.
        </p>
      </section>

      {/* RIGHT SIDE */}
      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <h2 className="text-2xl font-semibold text-slate-950">Login</h2>
        <p className="mt-2 text-sm text-slate-500">
          Use your phone number to continue.
        </p>

        <div className="mt-8 space-y-4">

          <StatusBanner tone={status.tone} message={status.message} />

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-slate-600">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-medium text-slate-600">Phone number</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="mt-2"
            />
          </div>

          {/* BUTTON */}
          <Button onClick={login} className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
      </section>
    </div>
  );
}