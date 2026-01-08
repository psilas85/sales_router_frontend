// sales_router_frontend/components/processamento/setorizacao/NovaSetorizacao.tsx

"use client";

import { useEffect, useState } from "react";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import ClusterParamsDrawer from "./ClusterParamsDrawer";
import ClusterProgressDrawer from "./ClusterProgressDrawer";
import ParametrosClusterizacao from "./ParametrosClusterizacao";
import {
  listarInputs,
  listarHistoricoClusterizacoes,
} from "@/services/cluster";

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

// ===============================
// Config
// ===============================
const LIMIT = 5;

// ===============================
// Status mapper
// ===============================
const STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  done: {
    label: "Concluído",
    className: "bg-green-100 text-green-700",
  },
  success: {
    label: "Concluído",
    className: "bg-green-100 text-green-700",
  },
  running: {
    label: "Em processamento",
    className: "bg-blue-100 text-blue-700",
  },
  queued: {
    label: "Na fila",
    className: "bg-gray-100 text-gray-700",
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

function StatusBadge({ status }: { status?: string }) {
  if (!status) {
    return (
      <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
        -
      </span>
    );
  }

  const meta =
    STATUS_MAP[status] ?? {
      label: status,
      className: "bg-gray-100 text-gray-700",
    };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}




// ===============================
// Component
// ===============================
export default function NovaSetorizacao() {
  const [inputs, setInputs] = useState<any[]>([]);
  const [totalInputs, setTotalInputs] = useState(0);
  const [paginaInputs, setPaginaInputs] = useState(0);

  const [clusterizacoes, setClusterizacoes] = useState<any[]>([]);
  const [inputSelecionado, setInputSelecionado] = useState<string | null>(null);

  const [mostrarProgresso, setMostrarProgresso] = useState(false);
  const [abrirInputs, setAbrirInputs] = useState(true);
  const [abrirHistorico, setAbrirHistorico] = useState(false);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [textoFiltro, setTextoFiltro] = useState("");

  // filtros aplicados (só mudam ao clicar em Filtrar)
  const [filtroAplicado, setFiltroAplicado] = useState({
    dataInicio: "",
    dataFim: "",
    textoFiltro: "",
  });

  const filtroAlterado =
    dataInicio !== filtroAplicado.dataInicio ||
    dataFim !== filtroAplicado.dataFim ||
    textoFiltro !== filtroAplicado.textoFiltro;



  // ===============================
  // LOADERS
  // ===============================
  async function carregarInputs() {
    const r = await listarInputs({
      limit: LIMIT,
      offset: paginaInputs * LIMIT,
      data_inicio: filtroAplicado.dataInicio || undefined,
      data_fim: filtroAplicado.dataFim || undefined,
      descricao: filtroAplicado.textoFiltro || undefined,
    });

    setInputs(r.inputs || []);
    setTotalInputs(r.total || 0);
  }


  async function carregarHistorico() {
    const r = await listarHistoricoClusterizacoes({
      limit: 5,
      offset: 0,
    });
    setClusterizacoes(r.clusterizacoes || []);
  }

  useEffect(() => {
    carregarInputs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaInputs, filtroAplicado]);


  useEffect(() => {
    carregarHistorico();
  }, []);

  const totalPaginasInputs = Math.max(
    1,
    Math.ceil(totalInputs / LIMIT)
  );

  function limparFiltroInputs() {
    setPaginaInputs(0);
    setDataInicio("");
    setDataFim("");
    setTextoFiltro("");

    setFiltroAplicado({
      dataInicio: "",
      dataFim: "",
      textoFiltro: "",
    });
  }


  function aplicarFiltro() {
    setPaginaInputs(0);
    setFiltroAplicado({
      dataInicio,
      dataFim,
      textoFiltro,
    });
  }


  // ===============================
  // Eventos globais
  // ===============================
  useEffect(() => {
    const abrir = () => setMostrarProgresso(true);
    window.addEventListener("abrir-progresso-cluster", abrir);
    return () =>
      window.removeEventListener("abrir-progresso-cluster", abrir);
  }, []);

  useEffect(() => {
    const fechar = () => {
      setMostrarProgresso(false);
      carregarHistorico();
      setAbrirHistorico(true);
      setAbrirInputs(false);
    };
    window.addEventListener("fechar-progresso-cluster", fechar);
    return () =>
      window.removeEventListener("fechar-progresso-cluster", fechar);
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Setorização
        </h1>
        <p className="text-[11px] text-gray-500">
          Selecione um input para executar a setorização
        </p>
      </div>     
      
      {/* INPUTS */}
      <CollapsibleSection
        title="Inputs disponíveis"
        open={abrirInputs}
        onToggle={() => setAbrirInputs((v) => !v)}
      >
        {/* FILTROS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-3 space-y-2">

          <h3 className="text-base font-semibold">Filtros</h3>

          <div className="grid grid-cols-12 gap-3 items-end">

            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="border px-2 py-1 text-sm rounded col-span-2"
            />


            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="border px-2 py-1 text-sm rounded col-span-2"
            />


            <input
              type="text"
              placeholder="Descrição ou Input ID..."
              value={textoFiltro}
              onChange={(e) => setTextoFiltro(e.target.value)}
              className="border px-2 py-1 text-sm rounded col-span-4"
            />


            <button
              onClick={aplicarFiltro}
              disabled={!filtroAlterado}
              className={`px-3 py-1 text-sm rounded col-span-2 ${
                filtroAlterado
                  ? "bg-brand text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Filtrar
            </button>

            <button
              onClick={limparFiltroInputs}
              className="px-3 py-1 text-sm bg-gray-200 rounded col-span-2"
            >
              Limpar
            </button>

          </div>
        </div>

        {/* TABELA INPUTS */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-2 py-1 text-left font-semibold text-xs w-[120px]">
                  Data
                </th>

                <th className="px-2 py-1 text-left font-semibold text-xs w-[35%]">
                  Descrição
                </th>

                <th className="px-2 py-1 text-left font-semibold text-xs w-[260px]">
                  Input ID
                </th>

                <th className="px-2 py-1 text-center font-semibold text-xs w-[70px]">
                  PDVs
                </th>

                <th className="px-2 py-1 text-center font-semibold text-xs w-[110px]">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {inputs.map((i, idx) => (
                <tr
                  key={i.input_id}
                  className={`border-t ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* DATA */}
                  <td className="px-2 py-1 whitespace-nowrap text-sm">
                    {formatDate(i.criado_em)}
                  </td>

                  {/* DESCRIÇÃO */}
                  <td
                    className="px-2 py-1 truncate text-sm"
                    title={i.descricao}
                  >
                    {i.descricao}
                  </td>

                  {/* INPUT ID */}
                  <td
                    className="px-2 py-1 text-sm font-mono text-gray-600 truncate whitespace-nowrap"
                    title={i.input_id}
                  >
                    {shortId(i.input_id)}
                  </td>


                  {/* PDVs */}
                  <td className="px-2 py-1 text-sm text-center">
                    {i.total_pdvs}
                  </td>

                  {/* AÇÃO */}
                  <td className="px-2 py-1 text-center">
                    <button
                      onClick={() => setInputSelecionado(i.input_id)}
                      className="bg-brand text-white px-3 py-1 rounded text-xs hover:opacity-90"
                    >
                      Setorizar
                    </button>
                  </td>
                </tr>
              ))}

              {inputs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4 text-gray-500 text-sm"
                  >
                    Nenhum input encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* PAGINAÇÃO INPUTS */}
        <div className="flex justify-between items-center mt-1 text-xs">

          <span className="text-gray-500">
            Página {paginaInputs + 1} de {totalPaginasInputs}
          </span>

          <div className="flex gap-2">
            <button
              disabled={paginaInputs === 0}
              onClick={() => setPaginaInputs((p) => p - 1)}
              className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              disabled={paginaInputs + 1 >= totalPaginasInputs}
              onClick={() => setPaginaInputs((p) => p + 1)}
              className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* HISTÓRICO — FIXO */}
      <CollapsibleSection
        title="Últimas clusterizações executadas"
        open={abrirHistorico}
        onToggle={() => setAbrirHistorico((v) => !v)}
      >
        <table className="w-full table-fixed text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-2 py-1 text-left font-semibold text-xs w-[130px]">
                Data
              </th>

              <th className="px-2 py-1 text-left font-semibold text-xs">
                Descrição
              </th>

              <th className="px-2 py-1 text-left font-semibold text-xs w-[200px]">
                Clusterization ID
              </th>

              <th className="px-2 py-1 text-center font-semibold text-xs w-[110px]">
                Região
              </th>

              <th className="px-2 py-1 text-center font-semibold text-xs w-[80px]">
                Clusters
              </th>

              <th className="px-2 py-1 text-center font-semibold text-xs w-[80px]">
                PDVs
              </th>

              <th className="px-2 py-1 text-center font-semibold text-xs w-[90px]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {clusterizacoes.map((c, idx) => (
              <tr
                key={c.clusterization_id}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* DATA */}
                <td className="px-2 py-1 whitespace-nowrap text-sm">
                  {formatDate(c.criado_em)}
                </td>

                {/* DESCRIÇÃO */}
                <td
                  className="px-2 py-1 truncate text-sm"
                  title={c.descricao}
                >
                  {c.descricao || "-"}
                </td>

                {/* CLUSTERIZATION ID */}
                <td
                  className="px-2 py-1 text-sm font-mono text-gray-600 truncate whitespace-nowrap"
                  title={c.clusterization_id}
                >
                  {shortId(c.clusterization_id)}
                </td>


                {/* REGIÃO */}
                <td className="px-2 py-1 text-center text-sm whitespace-nowrap">
                  {c.uf} · {c.cidade}
                </td>

                {/* CLUSTERS */}
                <td className="px-2 py-1 text-center text-sm">
                  {c.qtd_clusters ?? "-"}
                </td>

                {/* PDVs */}
                <td className="px-2 py-1 text-center text-sm">
                  {c.pdvs_total ?? "-"}
                </td>

                {/* STATUS */}
                <td className="px-2 py-1 text-center">
                  <StatusBadge status={c.status} />
                </td>
              </tr>
            ))}

            {clusterizacoes.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-500 text-sm"
                >
                  Nenhuma clusterização encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CollapsibleSection>

      {/* DRAWERS */}
      <ClusterParamsDrawer
        open={!!inputSelecionado}
        onClose={() => setInputSelecionado(null)}
      >
        {inputSelecionado && (
          <ParametrosClusterizacao
            inputId={inputSelecionado}
            onClose={() => setInputSelecionado(null)}
          />
        )}
      </ClusterParamsDrawer>

      <ClusterProgressDrawer
        open={mostrarProgresso}
        onClose={() => setMostrarProgresso(false)}
      />
    </div>
  );
}
