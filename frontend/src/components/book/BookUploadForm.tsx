"use client";

import { useState } from "react";
import axios from "axios";

export default function BookUploadForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [pdf, setPdf] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!pdf) {
      alert("PDF required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("file", pdf);

    if (image) {
      formData.append("coverImage", image);
    }

    try {
      await axios.post("http://localhost:3000/books/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer YOUR_TOKEN`,
        },
      });

      alert("Book uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Author"
        onChange={(e) => setAuthor(e.target.value)}
      />

      {/* PDF Upload */}
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files?.[0] || null)}
      />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
      />

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-40 object-cover rounded"
        />
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload Book
      </button>
    </div>
  );
}
