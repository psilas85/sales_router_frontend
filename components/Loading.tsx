"use client";

export default function Loading({ label }: { label?: string }) {
  return (
    <div className="p-4 text-gray-600 animate-pulse">
      {label || "Carregando..."}
    </div>
  );
}
