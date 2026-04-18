import Link from "next/link";
import BookTable from "@/components/book/BookTable";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/book/upload"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Book
        </Link>
      </div>

      <BookTable />
    </div>
  );
}
