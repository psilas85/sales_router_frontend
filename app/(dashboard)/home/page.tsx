// sales_router_frontend/app/(dashboard)/home/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Upload, Layers3, Route } from "lucide-react";

import { listarHistoricoProcessamentos } from "@/services/historico";
import { useAuthStore } from "@/store/useAuthStore";

// ===============================
// Utils
// ===============================
function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
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
    STATUS_META[status] ??
    {
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


function TipoLabel({ tipo }: { tipo: string }) {
  if (tipo === "Upload" || tipo === "PDV") return "📄 Upload";
  if (tipo === "Setorização") return "🧩 Setorização";
  if (tipo === "Roteirização") return "🛣️ Roteirização";
  return tipo;
}


// ===============================
// Component
// ===============================
export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregarUltimosJobs() {
    setLoading(true);
    try {
      const res = await listarHistoricoProcessamentos({
        limit: 5,
        offset: 0,
      });
      setJobs(res.dados || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) carregarUltimosJobs();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* ===== TÍTULO ===== */}
      <div>
        <h1 className="text-3xl font-semibold">Bem-vindo 👋</h1>
        <p className="text-gray-500">
          Acesse rapidamente as principais ações do sistema.
        </p>
      </div>

      {/* ===== CARDS DE ATALHO ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* UPLOAD */}
        <Link
          href="/processamento?tab=entrada"
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition"
        >
          <Upload size={28} className="text-brand mb-4" />
          <h3 className="text-lg font-semibold">Upload de Arquivos</h3>
          <p className="text-sm text-gray-500">
            Enviar e validar dados de entrada
          </p>
        </Link>

        {/* SETORIZAÇÃO */}
        <Link
          href="/processamento?tab=setorizacao"
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition"
        >
          <Layers3 size={28} className="text-brand mb-4" />
          <h3 className="text-lg font-semibold">Setorizar</h3>
          <p className="text-sm text-gray-500">
            Criar setores / territórios
          </p>
        </Link>

        {/* ROTEIRIZAÇÃO */}
        <Link
          href="/processamento?tab=roteirizacao"
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition"
        >
          <Route size={28} className="text-brand mb-4" />
          <h3 className="text-lg font-semibold">Roteirizar</h3>
          <p className="text-sm text-gray-500">
            Gerar roteiros de visitas
          </p>
        </Link>
      </div>

      {/* ===== ÚLTIMOS JOBS ===== */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Últimos Processamentos
        </h2>

        {loading && (
          <p className="text-sm text-gray-500">Carregando…</p>
        )}

        {!loading && jobs.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum processamento encontrado.
          </p>
        )}

        {!loading && jobs.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Tipo</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b">
                  <td className="py-2">
                    <TipoLabel tipo={j.tipo} />
                  </td>
                  <td>{formatDate(j.data)}</td>
                  <td>{j.descricao}</td>
                  <td>
                    <StatusBadge status={j.status} />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

        <div className="mt-4">
          <Link
            href="/historico"
            className="text-brand text-sm hover:underline"
          >
            Ver histórico completo →
          </Link>

        </div>
      </div>
    </div>
  );
}

