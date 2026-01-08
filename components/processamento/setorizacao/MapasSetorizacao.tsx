//sales_router_frontend/components/processamento/setorizacao/MapasSetorizacao.tsx

"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import {
  listarHistoricoClusterizacoes,
  gerarMapa,
} from "@/services/cluster";
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

// ===============================
// Config
// ===============================
const LIMIT = 5;

function mapStatus(status?: string) {
  switch (status) {
    case "done":
      return {
        label: "Concluído",
        className: "bg-green-100 text-green-700",
      };
    case "error":
      return {
        label: "Erro",
        className: "bg-red-100 text-red-700",
      };
    case "processing":
    case "running":
      return {
        label: "Processando",
        className: "bg-yellow-100 text-yellow-700",
      };
    default:
      return {
        label: status || "-",
        className: "bg-gray-100 text-gray-700",
      };
  }
}

// ===============================
// Component
// ===============================
export default function MapasSetorizacao() {
  const [clusterizacoes, setClusterizacoes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [gerandoMapaId, setGerandoMapaId] = useState<string | null>(null);



  // filtros
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricaoFiltro, setDescricaoFiltro] = useState("");

  const [filtroAplicado, setFiltroAplicado] = useState({
    dataInicio: "",
    dataFim: "",
    descricao: "",
  });

  const filtroAlterado =
    dataInicio !== filtroAplicado.dataInicio ||
    dataFim !== filtroAplicado.dataFim ||
    descricaoFiltro !== filtroAplicado.descricao;

  async function carregar() {
    const r = await listarHistoricoClusterizacoes({
      limit: LIMIT,
      offset: pagina * LIMIT,
      data_inicio: filtroAplicado.dataInicio || undefined,
      data_fim: filtroAplicado.dataFim || undefined,
      descricao: filtroAplicado.descricao || undefined,
    });

    setClusterizacoes(r.clusterizacoes || []);
    setTotal(r.total || 0);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, filtroAplicado]);

  const totalPaginas = Math.max(1, Math.ceil(total / LIMIT));

  function aplicarFiltro() {
    setPagina(0);
    setFiltroAplicado({
      dataInicio,
      dataFim,
      descricao: descricaoFiltro,
    });
  }

  function limparFiltro() {
    setPagina(0);
    setDataInicio("");
    setDataFim("");
    setDescricaoFiltro("");
    setFiltroAplicado({ dataInicio: "", dataFim: "", descricao: "" });
  }
  

  async function handleGerarMapa(clusterization_id: string) {
    if (gerandoMapaId === clusterization_id) return;

    setGerandoMapaId(clusterization_id);
    const toastId = toast.loading("Gerando mapa...");

    try {
      await gerarMapa(clusterization_id);

      toast.success(
        "Mapa em geração. Pode levar alguns segundos.",
        { id: toastId }
      );
    } catch (e: any) {
      toast.error(
        e?.response?.data?.detail || "Erro ao gerar mapa.",
        { id: toastId }
      );
    } finally {
      setGerandoMapaId(null);
    }
  }

 

  async function abrirMapa(clusterization_id: string) {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const tenantId = useAuthStore.getState().user?.tenant_id;

    if (!tenantId) {
      toast.error("Tenant não identificado. Faça login novamente.");
      return;
    }

    const url = `${base}/output/maps/${tenantId}/clusterization_${clusterization_id}.html`;

    const toastId = toast.loading("Verificando mapa...");

    try {
      const res = await fetch(url, { method: "HEAD" });

      if (!res.ok) {
        throw new Error("not_found");
      }

      toast.dismiss(toastId);
      window.open(url, "_blank");

    } catch {
      toast.error(
        "Nenhum mapa encontrado. Gere o mapa primeiro.",
        { id: toastId }
      );
    }
  }


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
            value={descricaoFiltro}
            onChange={(e) => setDescricaoFiltro(e.target.value)}
            className="border p-2 rounded text-sm col-span-4"
          />

          <button
            onClick={aplicarFiltro}
            disabled={!filtroAlterado}
            className={`px-4 py-2 rounded text-sm col-span-2 ${
              filtroAlterado
                ? "bg-brand text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
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
          Mapas de Clusterização
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-700">
                <th className="px-2 py-2 text-left w-[160px]">
                  Data
                </th>

                <th className="px-2 text-left">
                  Descrição
                </th>

                <th className="px-2 text-left w-[360px] whitespace-nowrap">
                  Clusterization ID
                </th>

                <th className="px-2 text-center w-[120px]">
                  Status
                </th>

                <th className="px-2 text-center w-[200px]">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {clusterizacoes.map((c: any, idx: number) => (
                <tr
                  key={c.clusterization_id}
                  className={`border-b last:border-b-0 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-2 py-2 whitespace-nowrap">
                    {formatDate(c.criado_em)}
                  </td>

                  <td className="px-2 truncate whitespace-nowrap">
                    {c.descricao || "-"}
                  </td>

                  <td
                    className="px-2 font-mono text-[11px] text-gray-700 whitespace-nowrap"
                    title={c.clusterization_id}
                  >
                    {c.clusterization_id}
                  </td>

                  <td className="px-2 text-center whitespace-nowrap">
                    {(() => {
                      const s = mapStatus(c.status);
                      return (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${s.className}`}
                        >
                          {s.label}
                        </span>
                      );
                    })()}
                  </td>


                  <td className="px-2 text-center whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      <button
                        disabled={gerandoMapaId === c.clusterization_id}
                        onClick={() => handleGerarMapa(c.clusterization_id)}
                        className={`px-3 py-1 rounded-md text-xs text-white ${
                          gerandoMapaId === c.clusterization_id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:opacity-95"
                        }`}
                      >
                        {gerandoMapaId === c.clusterization_id
                          ? "Gerando..."
                          : "Gerar mapa"}
                      </button>

                      <button
                        disabled={c.status !== "done" && c.status !== "success"}
                        onClick={() => abrirMapa(c.clusterization_id)}
                        className={`px-3 py-1 rounded-md text-xs text-white ${
                          c.status === "done" || c.status === "success"
                            ? "bg-brand hover:opacity-95"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        Abrir mapa
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {clusterizacoes.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Nenhuma clusterização encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="flex justify-between items-center mt-3 text-xs">
          <span className="text-gray-500">
            Página {pagina + 1} de {totalPaginas}
          </span>

          <div className="flex gap-2">
            <button
              disabled={pagina === 0}
              onClick={() => setPagina((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
