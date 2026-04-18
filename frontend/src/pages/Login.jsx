import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [phone, setPhone] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        phone,
        name: "User",
      });

      localStorage.setItem("token", res.data.token);
      alert("Logged in!");
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
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