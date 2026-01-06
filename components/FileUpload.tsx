//sales_router_frontend/components/FileUpload.tsx

"use client";

export default function FileUpload({
  onSelect,
}: {
  onSelect: (file: File) => void;
}) {
  return (
    <input
      type="file"
      accept=".csv"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onSelect(file);
      }}
      className="block w-full p-2 border border-gray-300 rounded-lg cursor-pointer bg-white text-sm"
    />
  );
}

