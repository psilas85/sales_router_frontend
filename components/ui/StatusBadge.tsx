const MAP: Record<string, { label: string; cls: string }> = {
  done: { label: "Concluído", cls: "bg-green-100 text-green-800" },
  success: { label: "Concluído", cls: "bg-green-100 text-green-800" },
  running: { label: "Em execução", cls: "bg-yellow-100 text-yellow-800" },
  queued: { label: "Na fila", cls: "bg-gray-100 text-gray-800" },
  failed: { label: "Erro", cls: "bg-red-100 text-red-800" },
  error: { label: "Erro", cls: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelado", cls: "bg-orange-100 text-orange-800" },
};

export default function StatusBadge({ status }: { status?: string }) {
  if (!status) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-600">
        -
      </span>
    );
  }

  const meta =
    MAP[status] || {
      label: status,
      cls: "bg-gray-100 text-gray-800",
    };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}
