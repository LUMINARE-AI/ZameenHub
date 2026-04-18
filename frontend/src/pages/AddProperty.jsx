import { useState } from "react";
import API from "../services/api";

export default function AddProperty() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const submit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("image", image);

      await API.post("/properties", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Property Added!");
    } catch (err) {
      console.log(err);
      alert("Error adding property");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl">

      <h2 className="text-xl font-bold mb-4">Add Property</h2>

      <input
        placeholder="Title"
        className="border p-2 w-full mb-3"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Price"
        className="border p-2 w-full mb-3"
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        placeholder="Location"
        className="border p-2 w-full mb-3"
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Property
      </button>

    </div>
  );
}