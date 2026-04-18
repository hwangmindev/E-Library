import BookUploadForm from "@/components/book/BookUploadForm";

export default function BookUploadPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-2xl font-bold mb-6">Upload New Book</h1>
      <BookUploadForm />
    </div>
  );
}
