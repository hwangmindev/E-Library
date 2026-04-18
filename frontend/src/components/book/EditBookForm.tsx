"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function EditBookForm({ id }: { id: string }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // 📥 Fetch existing book
  useEffect(() => {
    const fetchBook = async () => {
      const res = await axios.get(`http://127.0.0.1:4000/books/${id}`);

      const book = res.data;

      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description || "");
      setExistingImage(book.coverImage);
    };

    fetchBook();
  }, [id]);

  // 🖼️ handle new image
  const handleImageChange = (file: File) => {
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);

    if (newImage) {
      formData.append("coverImage", newImage);
    }

    try {
      setLoading(true);

      await axios.patch(`http://127.0.0.1:4000/books/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-5">
      {/* Title */}
      <div>
        <label className="text-sm">Title</label>
        <input
          className="w-full border p-2 rounded mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Author */}
      <div>
        <label className="text-sm">Author</label>
        <input
          className="w-full border p-2 rounded mt-1"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm">Description</label>
        <textarea
          className="w-full border p-2 rounded mt-1"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Existing Image */}
      {existingImage && !preview && (
        <img
          src={`http://127.0.0.1:4000${existingImage}`}
          className="w-32 h-44 object-cover rounded"
        />
      )}

      {/* New Image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
      />

      {preview && (
        <img src={preview} className="w-32 h-44 object-cover rounded" />
      )}

      {/* Submit */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Updating..." : "Update Book"}
      </button>
    </div>
  );
}
