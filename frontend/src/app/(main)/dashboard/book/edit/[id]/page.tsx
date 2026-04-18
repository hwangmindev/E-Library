import EditBookForm from "@/components/book/EditBookForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      <EditBookForm id={id} />
    </div>
  );
}
