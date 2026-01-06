// sales_router_frontend/app/(dashboard)/roteirizacao/mapas/page.tsx

"use client";

import { useEffect, useState } from "react";
import Title from "@/components/Title";
import { listarRoutingRuns, gerarMapaRoteirizacao } from "@/services/routing";
import toast from "react-hot-toast";

function formatDate(value: string) {
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

export default function MapasRoteirizacao() {
  const [runs, setRuns] = useState<any[]>([]);
  const [originalRuns, setOriginalRuns] = useState<any[]>([]);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricaoFiltro, setDescricaoFiltro] = useState("");

  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function carregar() {
    try {
      const r = await listarRoutingRuns();
      const lista = r || [];

      setRuns(lista.slice(0, 20));
      setOriginalRuns(lista);
    } catch (e) {
      console.error("Erro ao carregar runs:", e);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function parseDate(v: string) {
    if (!v) return null;
    return new Date(v + "T00:00:00");
  }

  function filtrar() {
    let f = [...originalRuns];

    const inicio = parseDate(dataInicio);
    const fim = parseDate(dataFim);

    if (descricaoFiltro) {
      f = f.filter((j) =>
        (j.descricao || "")
          .toLowerCase()
          .includes(descricaoFiltro.toLowerCase())
      );
    }

    if (inicio) f = f.filter((j) => new Date(j.criado_em) >= inicio);

    if (fim) {
      const endOfDay = new Date(fim.getTime() + 86399999);
      f = f.filter((j) => new Date(j.criado_em) <= endOfDay);
    }

    setRuns(f.slice(0, 20));
  }

  return (
    <div className="p-8">
      <Title>Mapas de Roteirização</Title>

      {/* FILTROS */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

          <input
            type="text"
            placeholder="Descrição contém..."
            value={descricaoFiltro}
            onChange={(e) => setDescricaoFiltro(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <button
            onClick={filtrar}
            className="bg-brand text-white p-3 rounded-lg shadow hover:bg-brand/80"
          >
            Filtrar
          </button>

          <button
            onClick={carregar}
            className="bg-gray-200 text-gray-800 p-3 rounded-lg shadow hover:bg-gray-300"
          >
            Resetar
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Últimas Roteirizações</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 text-left">Data</th>
              <th className="text-left">Descrição</th>
              <th className="text-left">Routing ID</th>
              <th className="text-left">Rotas</th>
              <th className="text-left">Clusters</th>
              <th className="text-left">Ações</th>
            </tr>
          </thead>

          <tbody>
            {runs.map((r: any, idx: number) => (
              <tr
                key={r.routing_id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2">{formatDate(r.criado_em)}</td>
                <td>{r.descricao || "-"}</td>
                <td className="font-mono text-xs">{r.routing_id}</td>
                <td>{r.total_rotas}</td>
                <td>{r.clusters_processados}</td>

                <td className="flex gap-2 py-2">

                  {/* GERAR MAPA */}
                  <button
                    onClick={async () => {
                      try {
                        setLoadingId(r.routing_id);
                        toast.loading("Gerando mapa...");

                        const resp = await gerarMapaRoteirizacao(r.routing_id);

                        toast.dismiss();
                        toast.success("Mapa gerado com sucesso!");
                      } catch (e) {
                        toast.dismiss();
                        toast.error("Erro ao gerar o mapa");
                      } finally {
                        setLoadingId(null);
                      }
                    }}
                    disabled={loadingId === r.routing_id}
                    className={`px-3 py-1 rounded text-white flex items-center gap-2 ${
                      loadingId === r.routing_id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:opacity-90"
                    }`}
                  >
                    {loadingId === r.routing_id ? (
                      <>
                        Gerando...
                        <span className="animate-spin border border-white border-t-transparent rounded-full w-4 h-4" />
                      </>
                    ) : (
                      "Gerar Mapa"
                    )}
                  </button>

                  {/* ABRIR MAPA */}
                  <button
                    onClick={() => {
                      const base = process.env.NEXT_PUBLIC_API_URL;
                      const url = `${base}/output/maps/1/routing_${r.routing_id}.html`;
                      window.open(url, "_blank");
                    }}
                    className="px-3 py-1 bg-brand text-white rounded hover:opacity-90"
                  >
                    Abrir Mapa
                  </button>
                </td>
              </tr>
            ))}

            {runs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Nenhuma roteirização registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
