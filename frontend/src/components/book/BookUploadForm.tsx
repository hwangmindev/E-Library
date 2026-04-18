"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

export default function BookUploadForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const [pdf, setPdf] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // 📄 PDF Dropzone
  const pdfDropzone = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    onDrop: (files) => {
      setPdf(files[0]);
    },
  });

  // 🖼️ Image Dropzone
  const imageDropzone = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    multiple: false,
    onDrop: (files) => {
      const file = files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    },
  });

  // ✅ Validation
  const validate = () => {
    const newErrors: any = {};

    if (!title) newErrors.title = "Title is required";
    if (!author) newErrors.author = "Author is required";
    if (!pdf) newErrors.pdf = "PDF file is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("file", pdf!);

    if (image) {
      formData.append("coverImage", image);
    }

    try {
      setLoading(true);
      setProgress(0);

      await axios.post("http://127.0.0.1:4000/books/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      // 🚀 redirect after success
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      {/* Title */}
      <div>
        <label className="text-sm">Title *</label>
        <input
          className="w-full border p-2 rounded mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Author */}
      <div>
        <label className="text-sm">Author *</label>
        <input
          className="w-full border p-2 rounded mt-1"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {errors.author && (
          <p className="text-red-500 text-sm">{errors.author}</p>
        )}
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

      {/* 📄 PDF Dropzone */}
      <div>
        <label className="text-sm">Upload PDF *</label>
        <div
          {...pdfDropzone.getRootProps()}
          className="border-2 border-dashed p-6 rounded text-center cursor-pointer mt-2 hover:bg-gray-50"
        >
          <input {...pdfDropzone.getInputProps()} />
          {pdf ? (
            <p>{pdf.name}</p>
          ) : (
            <p>Drag & drop PDF here, or click to select</p>
          )}
        </div>
        {errors.pdf && <p className="text-red-500 text-sm">{errors.pdf}</p>}
      </div>

      {/* 🖼️ Image Dropzone */}
      <div>
        <label className="text-sm">Cover Image</label>
        <div
          {...imageDropzone.getRootProps()}
          className="border-2 border-dashed p-6 rounded text-center cursor-pointer mt-2 hover:bg-gray-50"
        >
          <input {...imageDropzone.getInputProps()} />
          <p>Drag & drop image here, or click</p>
        </div>

        {preview && (
          <img src={preview} className="mt-3 w-32 h-44 object-cover rounded" />
        )}
      </div>

      {/* 📊 Progress Bar */}
      {loading && (
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-blue-600 h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? `Uploading... ${progress}%` : "Upload Book"}
      </button>
    </div>
  );
}
