// sales_router_frontend/components/processamento/MapaTab.tsx

"use client";

import { useEffect, useState } from "react";
import {
  getUltimosJobsPDV,
  filtrarJobsPDV,
  gerarMapa,
} from "@/services/pdv";

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

const LIMIT = 5;

// ===============================
// Component
// ===============================
export default function MapaTab() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);

  const [loading, setLoading] = useState(false);
  const [gerando, setGerando] = useState<string | null>(null);

  // filtros
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  const filtroAtivo = !!(dataInicio || dataFim || descricao);

  // =========================================================
  // LOAD
  // =========================================================
  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  async function carregar() {
    try {
      setLoading(true);

      const params = {
        limit: LIMIT,
        offset: pagina * LIMIT,
      };

      const res = filtroAtivo
        ? await filtrarJobsPDV({
            data_inicio: dataInicio || undefined,
            data_fim: dataFim || undefined,
            descricao: descricao || undefined,
            ...params,
          })
        : await getUltimosJobsPDV(params);

      setJobs(res.jobs || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // FILTRO
  // =========================================================
  async function aplicarFiltro() {
    setPagina(0);
    carregar();
  }

  function limparFiltro() {
    setDataInicio("");
    setDataFim("");
    setDescricao("");
    setPagina(0);
  }

  // =========================================================
  // MAPA
  // =========================================================
  async function handleGerarMapa(inputId: string) {
    try {
      setGerando(inputId);
      await gerarMapa(inputId);
      alert("Mapa gerado com sucesso.");
    } catch {
      alert("Erro ao gerar mapa.");
    } finally {
      setGerando(null);
    }
  }

  function handleAbrirMapa(job: any) {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const nomeArquivo = `pdvs_${job.input_id}_BR.html`;
    const url = `${base}/output/maps/${job.tenant_id}/${nomeArquivo}`;
    window.open(url, "_blank");
  }

  const totalPaginas = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-4">
      {/* FILTROS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-12 gap-3 items-end">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border p-2 rounded text-sm col-span-2"
          />

          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border p-2 rounded text-sm col-span-2"
          />

          <input
            type="text"
            placeholder="Descrição contém..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border p-2 rounded text-sm col-span-4"
          />

          <button
            onClick={aplicarFiltro}
            className="px-4 py-2 rounded text-sm col-span-2 bg-brand text-white"
          >
            Filtrar
          </button>

          <button
            onClick={limparFiltro}
            className="px-4 py-2 bg-gray-200 rounded text-sm col-span-2"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Mapas de PDVs
        </h3>

        {loading && (
          <p className="text-xs text-gray-500">Carregando...</p>
        )}

        {!loading && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs table-fixed">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="px-2 py-2 text-left w-[160px]">Data</th>
                    <th className="px-2 text-left">Descrição</th>
                    <th className="px-2 text-left w-[360px]">Input ID</th>
                    <th className="px-2 text-center w-[200px]">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((j: any, idx: number) => (
                    <tr
                      key={j.job_id}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-2 py-2 whitespace-nowrap">
                        {formatDate(j.criado_em)}
                      </td>

                      <td className="px-2 truncate whitespace-nowrap">
                        {j.descricao || "-"}
                      </td>

                      <td className="px-2 font-mono text-[11px]">
                        {j.input_id}
                      </td>

                      <td className="px-2 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            disabled={gerando === j.input_id}
                            onClick={() => handleGerarMapa(j.input_id)}
                            className="px-3 py-1 rounded-md text-xs bg-blue-600 text-white"
                          >
                            {gerando === j.input_id
                              ? "Gerando..."
                              : "Gerar mapa"}
                          </button>

                          <button
                            onClick={() => handleAbrirMapa(j)}
                            className="px-3 py-1 rounded-md text-xs bg-brand text-white"
                          >
                            Abrir mapa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {jobs.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        Nenhum processamento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINAÇÃO */}
            {totalPaginas > 1 && (
              <div className="flex justify-between items-center mt-4 text-xs">
                <button
                  disabled={pagina === 0}
                  onClick={() => setPagina((p) => p - 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Anterior
                </button>

                <span>
                  Página {pagina + 1} de {totalPaginas}
                </span>

                <button
                  disabled={(pagina + 1) * LIMIT >= total}
                  onClick={() => setPagina((p) => p + 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
