"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deletBook, getBooks } from "@/lib/api/book";

type Book = {
  _id: string;
  title: string;
  author: string;
  description: string;
  fileUrl: string;
  categories: string[];
  isPublic: boolean;
  viewCount: number;
  downloadCount: number;
  coverImage?: string;
};

export default function BookTable() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const limit = 6;

  const totalPages = Math.ceil(total / limit);

  const fetchBooks = async () => {
    try {
      const res = await getBooks(page, limit, debouncedSearch);

      setBooks(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;

    await deletBook(id);

    if (books.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      fetchBooks();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchBooks();
  }, [page, debouncedSearch]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Books</h2>

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      {/* Grid instead of table */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <div
            key={book._id}
            className="relative group bg-white p-4 rounded-xl cursor-pointer shadow hover:shadow-md transition"
          >
            {/* Image */}
            {book.coverImage && (
              <img
                src={`http://127.0.0.1:4000${book.coverImage}`}
                className="w-full h-auto object-cover rounded mb-3"
              />
            )}

            {/* Info */}
            <div className="flex flex-col space-y-1">
              <h3 className="font-semibold text-lg">Title: {book.title}</h3>
              <p className="text-gray-500 text-sm">Athor: {book.author}</p>
              {/* <p className="text-gray-500 text-sm">
                Overview: {book.description}
              </p> */}
            </div>

            {/* Tooltip for description */}
            {book.description && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
                    w-64 bg-black text-white text-xs p-2 rounded 
                    opacity-0 group-hover:opacity-100 
                    transition pointer-events-none z-10"
              >
                {book.description}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between mt-4">
              <button
                className="text-blue-500 text-sm cursor-pointer"
                onClick={() => router.push(`/dashboard/book/edit/${book._id}`)}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(book._id)}
                className="text-red-500 text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No books found 📭
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 items-center">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} / {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
