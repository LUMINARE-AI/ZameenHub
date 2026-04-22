import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StatusBanner from "../components/StatusBanner";
import Toast from "../components/ui/Toast";

export default function AddProperty() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ tone: "", message: "" });
  const [toast, setToast] = useState({ message: "", tone: "info" });

  function showToast(message, tone = "info") {
    setToast({ message, tone });
    window.setTimeout(() => setToast({ message: "", tone: "info" }), 4000);
  }

  const submit = async () => {
    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);

    if (!trimmedTitle || !trimmedLocation || !trimmedDescription || !parsedPrice) {
      setStatus({ tone: "error", message: "Please complete every field and provide a valid price." });
      showToast("Complete the form before submission.", "error");
      return;
    }

    if (!localStorage.getItem("token")) {
      setStatus({ tone: "error", message: "Login is required to list a property." });
      showToast("Login required.", "error");
      return;
    }

    try {
      setLoading(true);
      setStatus({ tone: "", message: "" });

      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("price", parsedPrice);
      formData.append("location", trimmedLocation);
      formData.append("description", trimmedDescription);
      if (image) {
        formData.append("image", image);
      }

      await API.post("/properties", formData);

      setStatus({ tone: "success", message: "Your listing has been submitted and is pending approval." });
      showToast("Property submitted successfully.", "success");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to submit the listing. Please try again.";
      setStatus({ tone: "error", message });
      showToast(message, "error");
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
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      /><br /><br />

      <button onClick={submit} disabled={loading}>
        {loading ? "Adding..." : "Add Property"}
      </button>
    </div>
  );
}