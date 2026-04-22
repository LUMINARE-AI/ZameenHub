import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddProperty() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    // 🔴 VALIDATION
    if (!title || !price || !location || !description) {
      alert("Fill all fields");
      return;
    }

    // 🔴 TOKEN CHECK
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    if (!token) {
      alert("Login first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const res = await API.post("/properties", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 MOST IMPORTANT
        },
      });

      console.log("SUCCESS:", res.data);

      alert("Property added ✅");

      navigate("/dashboard");
    } catch (err) {
      console.log("ERROR FULL:", err);
      console.log("ERROR DATA:", err.response?.data);

      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Property</h2>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      /><br /><br />

      <input
        placeholder="Price"
        onChange={(e) => setPrice(e.target.value)}
      /><br /><br />

      <input
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
      /><br /><br />

      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      /><br /><br />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      /><br /><br />

      <button onClick={submit} disabled={loading}>
        {loading ? "Adding..." : "Add Property"}
      </button>
    </div>
  );
}