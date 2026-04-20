"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getBookById, updateBook } from "@/lib/api/book";
import toast from "react-hot-toast";

export default function EditBookForm({ id }: { id: string }) {
  const router = useRouter();
  const fetched = useRef(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // 📥 Fetch existing book
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchBook = async () => {
      const book = await getBookById(id);

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
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);

    if (newImage) {
      formData.append("coverImage", newImage);
    }

    try {
      setLoading(true);

      await updateBook(id, formData);

      toast.success("Edited Book");

      router.push("/dashboard");
    } catch (err) {
      toast.error("Updated failed");
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
        className="cursor-pointer"
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
