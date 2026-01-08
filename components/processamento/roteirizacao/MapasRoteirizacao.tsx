//sales_router_frontend/components/processamento/roteirizacao/MapasRoteirizacao.tsx

"use client";

import { useEffect, useState } from "react";
import {
  listarRoteirizacoes,
  gerarMapaRoteirizacao,
} from "@/services/routing";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

// ===============================
// Utils
// ===============================
function formatDate(value: string) {
  if (!value) return "-";
  const d = new Date(value);
  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

function shortId(id?: string) {
  if (!id) return "-";
  if (id.length <= 12) return id;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

const LIMIT = 5;

export default function MapasRoteirizacao() {
  const tenantId = useAuthStore((s) => s.user?.tenant_id);

  const [runsOriginais, setRunsOriginais] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [pagina, setPagina] = useState(0);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricaoFiltro, setDescricaoFiltro] = useState("");

  const [gerandoMapaId, setGerandoMapaId] = useState<string | null>(null);

  // ===============================
  // Load inicial
  // ===============================
  useEffect(() => {
    async function load() {
      const dados = await listarRoteirizacoes();
      setRunsOriginais(dados || []);
      setRuns(dados || []);
    }
    load();
  }, []);

  // ===============================
  // Filtros
  // ===============================
  function aplicarFiltro() {
    let filtrado = [...runsOriginais];

    if (dataInicio) {
      const inicio = new Date(dataInicio);
      inicio.setHours(0, 0, 0, 0);
      filtrado = filtrado.filter((r) => new Date(r.criado_em) >= inicio);
    }

    if (dataFim) {
      const fim = new Date(dataFim);
      fim.setHours(23, 59, 59, 999);
      filtrado = filtrado.filter((r) => new Date(r.criado_em) <= fim);
    }

    if (descricaoFiltro) {
      filtrado = filtrado.filter((r) =>
        (r.descricao || "")
          .toLowerCase()
          .includes(descricaoFiltro.toLowerCase())
      );
    }

    setPagina(0);
    setRuns(filtrado);
  }

  function limparFiltro() {
    setDataInicio("");
    setDataFim("");
    setDescricaoFiltro("");
    setPagina(0);
    setRuns(runsOriginais);
  }

  // ===============================
  // Paginação
  // ===============================
  const totalPaginas = Math.max(1, Math.ceil(runs.length / LIMIT));
  const inicio = pagina * LIMIT;
  const paginaAtual = runs.slice(inicio, inicio + LIMIT);

  // ===============================
  // Ações
  // ===============================
  async function handleGerarMapa(routingId: string) {
    if (gerandoMapaId === routingId) return;

    setGerandoMapaId(routingId);
    const toastId = toast.loading("Gerando mapa...");

    try {
      await gerarMapaRoteirizacao(routingId);

      toast.success("Mapa gerado com sucesso.", { id: toastId });
    } catch {
      toast.error("Erro ao gerar mapa.", { id: toastId });
    } finally {
      setGerandoMapaId(null);
    }
  }


  function abrirMapa(routingId: string) {
    if (!tenantId) {
      toast.error("Tenant não identificado. Faça login novamente.");
      return;
    }

    const base = process.env.NEXT_PUBLIC_API_URL;
    const url = `${base}/output/maps/${tenantId}/routing_${routingId}.html`;

    toast("Abrindo mapa...", { icon: "🗺️" });
    window.open(url, "_blank");
  }


  // ===============================
  // Render
  // ===============================
  return (
    <div className="space-y-4">
      {/* FILTROS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div>
            <label className="text-[11px] text-gray-600">Data início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-600">Data fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] text-gray-600">Descrição / ID</label>
            <input
              type="text"
              placeholder="Descrição contém ou ID..."
              value={descricaoFiltro}
              onChange={(e) => setDescricaoFiltro(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-full"
            />
          </div>

          <button
            onClick={aplicarFiltro}
            className="bg-brand text-white px-4 py-2 rounded-md text-sm hover:opacity-95"
          >
            Filtrar
          </button>

          <button
            onClick={limparFiltro}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Mapas de Roteirização
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-700">
                <th className="px-2 py-2 text-left whitespace-nowrap w-[160px]">
                  Data
                </th>

                <th className="px-2 text-left whitespace-nowrap w-[260px]">
                  Descrição
                </th>

                <th className="px-2 text-left whitespace-nowrap w-[360px]">
                  Routing ID
                </th>

                <th className="px-2 text-center whitespace-nowrap w-[160px]">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {paginaAtual.map((r: any, idx: number) => (
                <tr
                  key={r.routing_id}
                  className={`border-b last:border-b-0 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* Data */}
                  <td className="px-2 py-2 whitespace-nowrap">
                    {formatDate(r.criado_em)}
                  </td>

                  {/* Descrição */}
                  <td
                    className="px-2 whitespace-nowrap truncate"
                    title={r.descricao || "-"}
                  >
                    {r.descricao || "-"}
                  </td>

                  {/* Routing ID – SEM truncate */}
                  <td
                    className="px-2 font-mono text-[11px] text-gray-700 whitespace-nowrap"
                    title={r.routing_id}
                  >
                    {r.routing_id}
                  </td>

                  {/* Ações */}
                  <td className="px-2 text-center whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      <button
                        disabled={gerandoMapaId === r.routing_id}
                        onClick={() => handleGerarMapa(r.routing_id)}
                        className={`px-3 py-1 rounded-md text-xs text-white ${
                          gerandoMapaId === r.routing_id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:opacity-95"
                        }`}
                      >
                        {gerandoMapaId === r.routing_id ? "Gerando..." : "Gerar mapa"}
                      </button>

                      <button
                        onClick={() => abrirMapa(r.routing_id)}
                        className="px-3 py-1 rounded-md text-xs bg-brand text-white hover:opacity-95"
                      >
                        Abrir mapa
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {paginaAtual.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Nenhuma roteirização encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* PAGINAÇÃO */}
        <div className="flex justify-between items-center mt-3 text-xs">
          <span>
            Página {pagina + 1} de {totalPaginas}
          </span>

          <div className="flex gap-2">
            <button
              disabled={pagina === 0}
              onClick={() => setPagina((p) => p - 1)}
              className="px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
              className="px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
