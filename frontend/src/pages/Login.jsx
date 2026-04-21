import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import API from "../services/api";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    try {
      setLoading(true);
      const response = await API.post("/auth/login", { phone });
      localStorage.setItem("token", response.data.token);
      alert("Logged in successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.96))] p-8 text-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.5)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-300">Welcome back</p>
        <h1 className="mt-3 text-4xl font-semibold">Access your buyer and seller workspace</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
          Manage saved homes, track listing activity, and stay close to every property
          conversation in one polished dashboard.
        </p>
      </section>

      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <h2 className="text-2xl font-semibold text-slate-950">Login</h2>
        <p className="mt-2 text-sm text-slate-500">Use your phone number to continue.</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Phone number</label>
            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+91 98765 43210"
              className="mt-2"
            />
          </div>

          <Button onClick={login} className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
      </section>
    </div>
  );
}
