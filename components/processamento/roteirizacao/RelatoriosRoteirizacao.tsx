//sales_router_frontend/components/processamento/roteirizacao/RelatoriosRoteirizacao.tsx

"use client";

import { useEffect, useState } from "react";
import {
  listarRelatoriosRoteirizacao,
  exportarResumoRouting,
  exportarPDVsRouting,
} from "@/services/routing";
import toast from "react-hot-toast";

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

// ===============================
export default function RelatoriosRoteirizacao() {
  const LIMIT = 5;

  const [dados, setDados] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  const [exportandoId, setExportandoId] = useState<string | null>(null);


  async function carregar(p = 0) {
    setLoading(true);
    try {
      const r = await listarRelatoriosRoteirizacao({
        data_inicio: dataInicio || undefined,
        data_fim: dataFim || undefined,
        descricao: descricao || undefined,
        limit: LIMIT,
        offset: p * LIMIT,
      });

      setDados(r.roteirizacoes || []);
      setTotal(r.total || 0);
      setPagina(p);
    } finally {
      setLoading(false);
    }
  }

  function resetarFiltros() {
    setDataInicio("");
    setDataFim("");
    setDescricao("");
    carregar(0);
  }

  useEffect(() => {
    carregar(0);
    // eslint-disable-next-line
  }, []);

  const totalPaginas = Math.ceil(total / LIMIT);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">
          Relatórios de Roteirização
        </h1>
        <p className="text-xs text-gray-500">
          Histórico consolidado das roteirizações executadas
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          />

          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          />

          <input
            type="text"
            placeholder="Descrição contém..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          />

          <button
            onClick={() => carregar(0)}
            className="bg-brand text-white px-4 py-2 rounded text-sm"
          >
            Filtrar
          </button>

          <button
            onClick={resetarFiltros}
            className="bg-gray-200 px-4 py-2 rounded text-sm"
          >
            Resetar
          </button>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 text-left">Data</th>
              <th className="px-2 text-left">Descrição</th>
              <th className="px-2 text-center">Clusters</th>
              <th className="px-2 text-center">PDVs</th>
              <th className="px-2 text-left">Routing ID</th>
              <th className="px-2 text-left">Exportar</th>
            </tr>
          </thead>

          <tbody>
            {dados.map((r, i) => (
              <tr key={r.routing_id} className={i % 2 ? "bg-gray-50" : ""}>
                <td className="px-2 py-2">
                  {formatDate(r.criado_em)}
                </td>
                <td className="px-2">{r.descricao || "-"}</td>
                <td className="px-2 text-center">{r.clusters}</td>
                <td className="px-2 text-center">{r.total_pdvs}</td>
                <td className="px-2 font-mono text-[11px]">
                  {r.routing_id}
                </td>
                <td className="px-2 flex gap-2">
                  <button
                    disabled={exportandoId === r.routing_id}
                    onClick={async () => {
                      setExportandoId(r.routing_id);
                      try {
                        const res = await exportarResumoRouting(r.routing_id);

                        if (!res?.arquivo) {
                          throw new Error("Arquivo não gerado");
                        }

                        window.open(
                          `${process.env.NEXT_PUBLIC_API_URL}/${res.arquivo}`,
                          "_blank"
                        );
                      } catch {
                        toast.error("Erro ao exportar resumo.");
                      }
                      finally {
                        setExportandoId(null);
                      }
                    }}

                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                  >
                    {exportandoId === r.routing_id ? "Gerando..." : "Resumo"}
                  </button>


                  <button
                  onClick={async () => {
                    try {
                      const res = await exportarPDVsRouting(r.routing_id);

                      if (!res?.arquivo) {
                        throw new Error("Arquivo não gerado");
                      }

                      window.open(
                        `${process.env.NEXT_PUBLIC_API_URL}/${res.arquivo}`,
                        "_blank"
                      );
                    } catch (e) {
                      toast.error("Erro ao gerar relatório de PDVs.");
                    }
                  }}
                  className="bg-brand text-white px-2 py-1 rounded text-xs"
                >
                  PDVs
                </button>

                </td>
              </tr>
            ))}

            {!loading && dados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINAÇÃO */}
        <div className="flex justify-between mt-4 text-xs">
          <span>
            Página {pagina + 1} de {totalPaginas || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={pagina === 0}
              onClick={() => carregar(pagina - 1)}
              className="border px-3 py-1 rounded"
            >
              Anterior
            </button>
            <button
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => carregar(pagina + 1)}
              className="border px-3 py-1 rounded"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
