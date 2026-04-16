export default function ErrorNotification({ text = "" }) {
  return (
    <>
      <div className="mb-4 p-3 text-sm text-error bg-red-300 rounded-lg">
        {text}
      </div>
    </>
  );
}
