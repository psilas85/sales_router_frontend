// sales_router_frontend/app/(dashboard)/roteirizacao/nova/page.tsx
// sales_router_frontend/app/(dashboard)/roteirizacao/nova/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import { listarClusterizacoes, listarRuns } from "@/services/routing";
import { useAuthStore } from "@/store/useAuthStore";

export default function ListaSetorizacoesParaRoteirizar() {
  const router = useRouter();

  // AUTH STORE
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  // SETORIZAÇÃO
  const [lista, setLista] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  // ROTEIRIZAÇÕES
  const [runs, setRuns] = useState<any[]>([]);
  const [runsOriginal, setRunsOriginal] = useState<any[]>([]);
  const [limitRuns, setLimitRuns] = useState(20);

  // filtros setorização
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [busca, setBusca] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // filtros roteirização
  const [routingId, setRoutingId] = useState("");
  const [runInicio, setRunInicio] = useState("");
  const [runFim, setRunFim] = useState("");
  const [buscaDescricao, setBuscaDescricao] = useState("");

  // ============================================================
  // loadUser IMEDIATO
  // ============================================================
  useEffect(() => {
    useAuthStore.getState().loadUser();
  }, []);

  // ============================================================
  // Carregar dados quando token + user estiverem prontos
  // ============================================================
  useEffect(() => {
    if (!token) return;
    if (!user) return;

    carregar();
    carregarRuns();
  }, [token, user]);

  // ============================================================
  // CHAMADA API SETORIZAÇÕES
  // ============================================================
  async function carregar() {
    try {
      const res = await listarClusterizacoes();
      setLista(res || []);
      setFiltered(res || []);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar setorizações.");
    }
  }

  // ============================================================
  // CHAMADA API ROTEIRIZAÇÕES
  // ============================================================
  async function carregarRuns() {
    try {
      const res = await listarRuns();
      setRuns(res || []);
      setRunsOriginal(res || []);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar roteirizações.");
    }
  }

  // ============================================================
  // FILTROS SETORIZAÇÃO
  // ============================================================
  function aplicarFiltro() {
    let data = [...lista];

    if (uf.trim()) {
      data = data.filter((x) => x.uf?.toLowerCase() === uf.toLowerCase());
    }
    if (cidade.trim()) {
      data = data.filter((x) =>
        x.cidade?.toLowerCase().includes(cidade.toLowerCase())
      );
    }
    if (busca.trim()) {
      data = data.filter(
        (x) =>
          x.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
          x.clusterization_id?.includes(busca)
      );
    }
    if (dataInicio) {
      data = data.filter(
        (x) => new Date(x.criado_em) >= new Date(dataInicio)
      );
    }
    if (dataFim) {
      data = data.filter(
        (x) =>
          new Date(x.criado_em) <= new Date(dataFim + " 23:59:59")
      );
    }

    setFiltered(data);
  }

  function limparFiltros() {
    setUf("");
    setCidade("");
    setBusca("");
    setDataInicio("");
    setDataFim("");
    setFiltered(lista);
  }

  // ============================================================
  // FILTROS ROTEIRIZAÇÕES
  // ============================================================
  function aplicarFiltroRuns() {
    let data = [...runsOriginal];

    if (routingId.trim()) {
      data = data.filter((x) =>
        x.routing_id.toLowerCase().includes(routingId.toLowerCase())
      );
    }

    if (buscaDescricao.trim()) {
      data = data.filter((x) =>
        (x.descricao || "").toLowerCase().includes(buscaDescricao.toLowerCase())
      );
    }

    if (runInicio) {
      data = data.filter(
        (x) => new Date(x.criado_em) >= new Date(runInicio)
      );
    }

    if (runFim) {
      data = data.filter(
        (x) => new Date(x.criado_em) <= new Date(runFim + " 23:59:59")
      );
    }

    setRuns(data);
  }

  function limparFiltroRuns() {
    setRoutingId("");
    setBuscaDescricao("");
    setRunInicio("");
    setRunFim("");
    setRuns(runsOriginal);
  }

  // ----------------------
  // ROTERIZAÇÃO
  // ----------------------
  function abrirParametros(item: any) {
    const { clusterization_id, uf, cidade } = item;

    router.push(
      `/roteirizacao/nova/parametros?clusterization_id=${clusterization_id}&uf=${uf}&cidade=${cidade || ""}`
    );
  }

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="p-8">
      <Title>Nova Roteirização</Title>

      {/* FILTROS SETORIZAÇÃO */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtrar Setorizações</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="UF"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="border p-3 rounded-lg"
          />
          <input
            type="text"
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="border p-3 rounded-lg"
          />
          <input
            type="text"
            placeholder="Descrição / Cluster ID"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border p-3 rounded-lg"
          />
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border p-3 rounded-lg"
          />
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={aplicarFiltro}
            className="bg-brand text-white px-4 py-2 rounded-lg shadow"
          >
            Aplicar Filtro
          </button>

          <button
            onClick={limparFiltros}
            className="bg-gray-300 px-4 py-2 rounded-lg shadow"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* LISTA DE SETORIZAÇÕES */}
      <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Setorizações Finalizadas</h2>

        {!user || !token ? (
          <p className="text-gray-500">Carregando sessão...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">Nenhuma setorização encontrada.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 text-left">UF</th>
                <th className="text-left">Cidade</th>
                <th className="text-left">Descrição</th>
                <th className="text-left">Clusterization ID</th>
                <th className="text-left">Criado em</th>
                <th className="text-left">k_final</th>
                <th className="text-left">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item: any, idx: number) => (
                <tr
                  key={item.clusterization_id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-2">{item.uf || "-"}</td>
                  <td>{item.cidade || "-"}</td>
                  <td>{item.descricao || "-"}</td>
                  <td className="font-mono text-xs">{item.clusterization_id}</td>
                  <td>{new Date(item.criado_em).toLocaleString("pt-BR")}</td>
                  <td>{item.k_final}</td>

                  <td>
                    <button
                      onClick={() => abrirParametros(item)}
                      className="px-3 py-1 bg-brand text-white rounded hover:opacity-90"
                    >
                      Roteirizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FILTROS ROTEIRIZAÇÕES */}
      <div className="bg-white rounded-2xl shadow p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">Filtrar Roteirizações</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Routing ID"
            value={routingId}
            onChange={(e) => setRoutingId(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Descrição"
            value={buscaDescricao}
            onChange={(e) => setBuscaDescricao(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="date"
            value={runInicio}
            onChange={(e) => setRunInicio(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="date"
            value={runFim}
            onChange={(e) => setRunFim(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <div className="flex gap-2">
            <button
              onClick={aplicarFiltroRuns}
              className="bg-brand text-white px-4 py-2 rounded-lg w-full"
            >
              Filtrar
            </button>

            <button
              onClick={limparFiltroRuns}
              className="bg-gray-300 px-4 py-2 rounded-lg w-full"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* LISTA DE ROTEIRIZAÇÕES */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Últimas Roteirizações</h2>

        {runs.length === 0 ? (
          <p className="text-gray-500">Nenhuma roteirização encontrada.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 text-left">Routing ID</th>
                <th className="text-left">Descrição</th>
                <th className="text-left">Criado em</th>
                <th className="text-left">Clusters</th>
                <th className="text-left">Rotas</th>
                <th className="text-left">PDVs</th>
                <th className="text-left">Km Total</th>
                <th className="text-left">Min Total</th>
              </tr>
            </thead>

            <tbody>
              {runs.slice(0, limitRuns).map((item: any, idx: number) => (
                <tr
                  key={item.routing_id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-2 font-mono text-xs">{item.routing_id}</td>
                  <td>{item.descricao || "-"}</td>
                  <td>{new Date(item.criado_em).toLocaleString("pt-BR")}</td>
                  <td>{item.clusters_processados}</td>
                  <td>{item.total_rotas}</td>
                  <td>{item.total_pdvs}</td>
                  <td>{item.total_km?.toFixed(1)}</td>
                  <td>{item.total_min?.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {runs.length > limitRuns && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setLimitRuns(limitRuns + 20)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Carregar mais
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
