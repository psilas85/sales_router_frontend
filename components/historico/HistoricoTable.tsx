//sales_router_frontend/components/historico/HistoricoTable.tsx

"use client";

import Loading from "@/components/Loading";

// ===============================
// Utils
// ===============================
function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

function StatusBadge({ status }: { status: string }) {
  const STATUS_META: Record<
    string,
    { label: string; className: string }
  > = {
    queued: {
      label: "Na fila",
      className: "bg-gray-100 text-gray-700",
    },
    running: {
      label: "Em processamento",
      className: "bg-blue-100 text-blue-700",
    },
    done: {
      label: "Concluído",
      className: "bg-green-100 text-green-700",
    },
    success: {
      label: "Concluído",
      className: "bg-green-100 text-green-700",
    },
    error: {
      label: "Erro",
      className: "bg-red-100 text-red-700",
    },
    failed: {
      label: "Erro",
      className: "bg-red-100 text-red-700",
    },
    cancelled: {
      label: "Cancelado",
      className: "bg-yellow-100 text-yellow-700",
    },
  };

  const meta =
    STATUS_META[status] ?? {
      label: status,
      className: "bg-gray-100 text-gray-700",
    };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

// ===============================
// Component
// ===============================
export default function HistoricoTable({
  dados,
  loading,
}: {
  dados: any[];
  loading: boolean;
}) {
  if (loading) return <Loading />;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b text-gray-700">
            <th className="py-2">ID</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Descrição</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {dados.map((j, idx) => (
            <tr
              key={j.id}
              className={`border-b ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="py-2 font-mono text-xs">{j.id}</td>
              <td>{j.tipo}</td>
              <td>{formatDate(j.data)}</td>
              <td>{j.descricao}</td>
              <td>
                <StatusBadge status={j.status} />
              </td>
            </tr>
          ))}

          {dados.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-center py-6 text-gray-500"
              >
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
