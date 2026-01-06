// sales_router_frontend/components/processamento/roteirizacao/NovaRoteirizacao.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { listarClusterizacoes, listarRuns } from "@/services/routing";

import RoutingParamsDrawer from "./RoutingParamsDrawer";
import RoutingProgressDrawer from "./RoutingProgressDrawer";
import ParametrosRoteirizacao from "./ParametrosRoteirizacao";

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

// Converte qualquer string de data para "YYYY-MM-DD" e cria Date local
function parseDateLocal(value: string) {
  // suporta: "2025-12-31", "2025-12-31T16:17:00", "2025-12-31 16:17:00"
  const datePart = (value || "").trim().slice(0, 10); // YYYY-MM-DD
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function mapStatusToBadge(statusRaw?: string) {
  const s = (statusRaw || "").toLowerCase();

  if (s === "done" || s === "success" || s === "completed") return "success";
  if (s === "running" || s === "in_progress") return "running";
  if (s === "failed" || s === "error") return "error";
  if (s === "queued" || s === "pending") return "pending";
  if (s === "canceled" || s === "cancelled") return "canceled";
  return "pending";
}

function StatusBadgeLocal({ status }: { status: string }) {
  const s = mapStatusToBadge(status);

  const map: Record<string, { label: string; cls: string }> = {
    success: { label: "Concluído", cls: "bg-green-100 text-green-800" },
    running: { label: "Em execução", cls: "bg-blue-100 text-blue-800" },
    error: { label: "Falhou", cls: "bg-red-100 text-red-800" },
    pending: { label: "Na fila", cls: "bg-gray-100 text-gray-800" },
    canceled: { label: "Cancelado", cls: "bg-orange-100 text-orange-800" },
  };

  const item = map[s] || { label: status, cls: "bg-gray-100 text-gray-800" };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.cls}`}
    >
      {item.label}
    </span>
  );
}

// ===============================
// Component
// ===============================
export default function NovaRoteirizacao() {
  const LIMIT = 5;

  // dados principais (clusterizações)
  const [dados, setDados] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);

  // filtros
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  // seleção
  const [selecionada, setSelecionada] = useState<any | null>(null);

  // progresso
  const [mostrarProgresso, setMostrarProgresso] = useState(false);

  // histórico
  const [runs, setRuns] = useState<any[]>([]);
  const [abrirHistorico, setAbrirHistorico] = useState(true);

  function resetarFiltros() {
    setDataInicio("");
    setDataFim("");
    setDescricao("");
    setPagina(0);
    setTimeout(() => carregar(0), 0);
  }

  // ===============================
  // LOADERS
  // ===============================
  async function carregar(p = 0) {
    setLoading(true);
    try {
      let lista = (await listarClusterizacoes()) || [];

      // filtros de data (robustos)
      if (dataInicio) {
        const inicio = parseDateLocal(dataInicio);
        lista = lista.filter((x: any) => {
          const d = parseDateLocal(String(x.criado_em || ""));
          return d >= inicio;
        });
      }

      if (dataFim) {
        const fim = parseDateLocal(dataFim);
        fim.setHours(23, 59, 59, 999);
        lista = lista.filter((x: any) => {
          const d = parseDateLocal(String(x.criado_em || ""));
          return d <= fim;
        });
      }

      if (descricao) {
        const q = descricao.toLowerCase();
        lista = lista.filter(
          (x: any) =>
            (x.descricao || "").toLowerCase().includes(q) ||
            String(x.clusterization_id || "").includes(descricao)
        );
      }

      setTotal(lista.length);
      setPagina(p);

      const ini = p * LIMIT;
      const fim = ini + LIMIT;
      setDados(lista.slice(ini, fim));
    } finally {
      setLoading(false);
    }
  }

  async function carregarRuns() {
    const r = await listarRuns();
    setRuns((r || []).slice(0, 5));
  }

  useEffect(() => {
    carregar(0);
    carregarRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===============================
  // Eventos globais (progresso)
  // ===============================
  useEffect(() => {
    const abrir = () => setMostrarProgresso(true);
    const fechar = () => {
      setMostrarProgresso(false);
      carregarRuns();
      setAbrirHistorico(true);
    };

    window.addEventListener("abrir-progresso-routing", abrir);
    window.addEventListener("fechar-progresso-routing", fechar);

    return () => {
      window.removeEventListener("abrir-progresso-routing", abrir);
      window.removeEventListener("fechar-progresso-routing", fechar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPaginas = useMemo(() => Math.ceil(total / LIMIT), [total]);

  const rangeLabel = useMemo(() => {
    const ini = total === 0 ? 0 : pagina * LIMIT + 1;
    const fim = Math.min((pagina + 1) * LIMIT, total);
    return `${ini}-${fim} de ${total}`;
  }, [pagina, total]);

  const temFiltros = useMemo(() => {
    return !!dataInicio || !!dataFim || !!descricao;
  }, [dataInicio, dataFim, descricao]);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="p- space-y-">
      {/* HEADER (alinhado com Nova Setorização) */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-800">Roteirização</h1>
          <p className="text-xs text-gray-500">
            Selecione uma setorização concluída para gerar rotas
          </p>
        </div>

        <div className="text-xs text-gray-500 md:mt-1">
          {loading ? "Carregando..." : `Exibindo ${rangeLabel}`}
        </div>
      </div>

      {/* FILTROS (card padrão) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Filtros</h2>
          {temFiltros && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              Ativos
            </span>
          )}
        </div>

        {/* Linha única no desktop */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          {/* Data início */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-600">Data início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-[160px]"
            />
          </div>

          {/* Data fim */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-600">Data fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-[160px]"
            />
          </div>

          {/* Descrição / ID */}
          <div className="flex flex-col gap-1 flex-1 min-w-[260px]">
            <label className="text-[11px] text-gray-600">Descrição / ID</label>
            <input
              type="text"
              placeholder="Descrição contém ou ID..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-full"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <button
              onClick={() => carregar(0)}
              className="bg-brand text-white px-4 py-2 rounded-md text-sm hover:opacity-95 whitespace-nowrap"
            >
              Filtrar
            </button>

            <button
              onClick={resetarFiltros}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 whitespace-nowrap"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* TABELA PRINCIPAL (card padrão) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Setorizações</h2>
          <div className="text-xs text-gray-500">
            {total > 0 ? `Total: ${total}` : ""}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-700">
                <th className="py-2 px-2 text-left font-semibold whitespace-nowrap">
                  Data
                </th>

                <th className="px-2 text-left font-semibold whitespace-nowrap">
                  Descrição
                </th>

                <th className="px-2 text-center font-semibold w-[60px]">
                  UF
                </th>

                <th className="px-2 text-center font-semibold whitespace-nowrap">
                  Clusters
                </th>

                <th className="px-2 text-center font-semibold whitespace-nowrap">
                  PDVs
                </th>

                <th className="px-2 text-left font-semibold whitespace-nowrap">
                  Clusterization ID
                </th>

                <th className="px-2 text-left font-semibold whitespace-nowrap">
                  Status
                </th>

                <th className="px-2 text-left font-semibold whitespace-nowrap">
                  Ação
                </th>
              </tr>
            </thead>

            <tbody>
              {dados.map((c: any, idx: number) => {
                const badge = mapStatusToBadge(c.status);
                const podeRoteirizar = badge === "success";

                return (
                  <tr
                    key={c.clusterization_id}
                    className={`border-b last:border-b-0 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {/* Data */}
                    <td className="py-2 px-2 whitespace-nowrap">
                      {formatDate(c.criado_em)}
                    </td>

                    {/* Descrição (SEM UF / SEM CIDADE) */}
                    <td
                      className="px-2 truncate whitespace-nowrap max-w-[280px]"
                      title={c.descricao || "-"}
                    >
                      {c.descricao || "-"}
                    </td>

                    {/* UF */}
                    <td className="px-2 text-center font-medium whitespace-nowrap">
                      {c.uf || "-"}
                    </td>

                    {/* Clusters */}
                    <td className="px-2 text-center whitespace-nowrap">
                      {c.qtd_clusters ?? "-"}
                    </td>

                    {/* PDVs */}
                    <td className="px-2 text-center whitespace-nowrap">
                      {c.pdvs_total ?? c.pdvs ?? "-"}
                    </td>

                    {/* Clusterization ID */}
                    <td
                      className="px-2 font-mono text-[11px] text-gray-700 truncate whitespace-nowrap max-w-[340px]"
                      title={c.clusterization_id}
                    >
                      {c.clusterization_id}
                    </td>

                    {/* Status */}
                    <td className="px-2 whitespace-nowrap">
                      <StatusBadgeLocal status={c.status} />
                    </td>

                    {/* Ação */}
                    <td className="px-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelecionada(c)}
                        disabled={!podeRoteirizar}
                        title={
                          podeRoteirizar
                            ? "Gerar roteirização"
                            : "Somente setorizações concluídas podem ser roteirizadas"
                        }
                        className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                          podeRoteirizar
                            ? "bg-brand text-white hover:opacity-95"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Roteirizar
                      </button>
                    </td>
                  </tr>
                );
              })}

              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Carregando...
                  </td>
                </tr>
              )}

              {!loading && dados.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* PAGINAÇÃO (padrão) */}
        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mt-4 text-xs">
          <span className="text-gray-600">
            Página {pagina + 1} de {totalPaginas || 1}
          </span>

          <div className="flex gap-2">
            <button
              disabled={pagina === 0 || loading}
              onClick={() => carregar(pagina - 1)}
              className="px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              disabled={pagina + 1 >= totalPaginas || loading}
              onClick={() => carregar(pagina + 1)}
              className="px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {/* HISTÓRICO (card + colapsável no mesmo estilo) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setAbrirHistorico((v) => !v)}
        >
          <h2 className="text-sm font-semibold text-gray-700">
            Últimas roteirizações executadas
          </h2>
          <span className="text-xs text-gray-500">
            {abrirHistorico ? "Ocultar" : "Mostrar"}
          </span>
        </div>

        {abrirHistorico && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-700">
                  <th className="px-2 py-2 text-left font-semibold">Data</th>
                  <th className="px-2 text-left font-semibold">Descrição</th>
                  <th className="px-2 text-left font-semibold">Routing ID</th>
                  <th className="px-2 text-center font-semibold">Rotas</th>
                  <th className="px-2 text-center font-semibold">PDVs</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r: any, idx: number) => (
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
                      className="px-2 truncate whitespace-nowrap max-w-[240px]"
                      title={r.descricao || "-"}
                    >
                      {r.descricao || "-"}
                    </td>

                    {/* Routing ID */}
                    <td
                      className="px-2 font-mono text-[11px] text-gray-700 truncate whitespace-nowrap max-w-[320px]"
                      title={r.routing_id}
                    >
                      {r.routing_id}
                    </td>

                    {/* Rotas */}
                    <td className="px-2 text-center whitespace-nowrap">
                      {r.total_rotas ?? "-"}
                    </td>

                    {/* PDVs */}
                    <td className="px-2 text-center whitespace-nowrap">
                      {r.total_pdvs ?? "-"}
                    </td>
                  </tr>
                ))}

                {runs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Nenhuma roteirização encontrada.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* DRAWERS */}
      <RoutingParamsDrawer open={!!selecionada} onClose={() => setSelecionada(null)}>
        {selecionada && (
          <ParametrosRoteirizacao
            clusterizationId={selecionada.clusterization_id}
            uf={selecionada.uf}
            cidade={selecionada.cidade || null}
            onClose={() => setSelecionada(null)}
          />
        )}
      </RoutingParamsDrawer>

      <RoutingProgressDrawer
        open={mostrarProgresso}
        onClose={() => setMostrarProgresso(false)}
      />
    </div>
  );
}
