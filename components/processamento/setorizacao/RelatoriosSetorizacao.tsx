//sales_router_frontend/components/processamento/setorizacao/RelatoriosSetorizacao.tsx

"use client";

import { useEffect, useState } from "react";
import {
  listarHistoricoClusterizacoes,
  exportarResumo,
  exportarDetalhado,
} from "@/services/cluster";

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
  const map: Record<
    string,
    { label: string; className: string }
  > = {
    done: {
      label: "Concluído",
      className: "bg-green-100 text-green-800",
    },
    running: {
      label: "Em processamento",
      className: "bg-yellow-100 text-yellow-800",
    },
    queued: {
      label: "Na fila",
      className: "bg-gray-100 text-gray-800",
    },
    failed: {
      label: "Erro",
      className: "bg-red-100 text-red-800",
    },
    error: {
      label: "Erro",
      className: "bg-red-100 text-red-800",
    },
  };

  const meta =
    map[status] ?? {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}


function EstrategiaLabel({ algo }: { algo?: string }) {
  const map: Record<string, string> = {
    kmeans: "SIMULATOR",
    capacitated_sweep: "DIVISOR",
    dense_subset: "SELECTOR",
  };

  return (
    <span className="text-xs font-medium text-gray-700">
      {map[algo ?? ""] ?? "—"}
    </span>
  );
}

// ===============================
// Component
// ===============================
export default function RelatoriosSetorizacao() {
  const LIMIT = 5;

  const [dados, setDados] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);

  // filtros
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  async function carregar(p = 0) {
    setLoading(true);
    try {
      const r = await listarHistoricoClusterizacoes({
        data_inicio: dataInicio || undefined,
        data_fim: dataFim || undefined,
        descricao: descricao || undefined,
        limit: LIMIT,
        offset: p * LIMIT,
      });

      setDados(r.clusterizacoes || []);
      setTotal(r.total || 0);
      setPagina(p);
    } catch (e) {
      console.error("Erro ao carregar histórico:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPaginas = Math.ceil(total / LIMIT);

  return (
    <div className="p-6 space-y-6">
      {/* TÍTULO */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Relatórios de Setorização
        </h1>
        <p className="text-xs text-gray-500">
          Histórico consolidado das setorizações executadas
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3 text-gray-700">
          Filtros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <input
            type="text"
            placeholder="Descrição contém..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <button
            onClick={() => carregar(0)}
            className="bg-brand text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
          >
            Filtrar
          </button>

          <button
            onClick={() => {
              setDataInicio("");
              setDataFim("");
              setDescricao("");
              carregar(0);
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
          >
            Resetar
          </button>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3 text-gray-700">
          Setorizações
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="py-2 px-2 text-left">Data</th>
                <th className="px-2 text-left">Descrição</th>
                <th className="px-2 text-left">Estratégia</th>
                <th className="px-2 text-center">Clusters</th>
                <th className="px-2 text-center">PDVs</th>
                <th className="px-2 text-left w-[220px]">
                  Clusterization ID
                </th>
                <th className="px-2 text-left">Status</th>
                <th className="px-2 text-left">Exportar</th>
              </tr>
            </thead>

            <tbody>
              {dados.map((c, idx) => (
                <tr
                  key={c.clusterization_id}
                  className={`border-b last:border-b-0 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-2 px-2 whitespace-nowrap">
                    {formatDate(c.criado_em)}
                  </td>

                  <td
                    className="px-2 truncate"
                    title={c.descricao || "-"}
                  >
                    {c.descricao || "-"}
                  </td>

                  <td className="px-2">
                    <EstrategiaLabel algo={c.algo} />
                  </td>

                  <td className="px-2 text-center">
                    {c.qtd_clusters ?? "-"}
                  </td>

                  <td className="px-2 text-center">
                    {c.pdvs_total ?? "-"}
                  </td>

                  <td
                    className="px-2 font-mono text-[11px] text-gray-700
                              truncate whitespace-nowrap"
                    title={c.clusterization_id}
                  >
                    {c.clusterization_id}
                  </td>

                  <td className="px-2">
                    <StatusBadge status={c.status} />
                  </td>

                  <td className="px-2">
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const r = await exportarResumo(
                            c.clusterization_id
                          );
                          if (r?.arquivo) {
                            const base =
                              process.env.NEXT_PUBLIC_API_URL;
                            window.open(
                              `${base}/${r.arquivo}`,
                              "_blank"
                            );
                          }
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs"
                      >
                        Resumo
                      </button>

                      <button
                        onClick={async () => {
                          const r = await exportarDetalhado(
                            c.clusterization_id
                          );
                          if (r?.arquivo) {
                            const base =
                              process.env.NEXT_PUBLIC_API_URL;
                            window.open(
                              `${base}/${r.arquivo}`,
                              "_blank"
                            );
                          }
                        }}
                        className="px-2 py-1 bg-brand text-white rounded-md text-xs"
                      >
                        PDVs
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && dados.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="flex justify-between items-center mt-4 text-xs">
          <span>
            Página {pagina + 1} de {totalPaginas || 1}
          </span>

          <div className="flex gap-2">
            <button
              disabled={pagina === 0}
              onClick={() => carregar(pagina - 1)}
              className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => carregar(pagina + 1)}
              className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
