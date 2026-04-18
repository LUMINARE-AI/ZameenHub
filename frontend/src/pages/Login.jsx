import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [phone, setPhone] = useState("");

  const login = async () => {
    const res = await API.post("/auth/login", { phone });

    localStorage.setItem("token", res.data.token);
    alert("Logged in!");
  };

  return (
    <div className="p-6">
      <input
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={login} className="bg-blue-600 text-white p-2 ml-2">
        Login
      </button>
    </div>
  );
}