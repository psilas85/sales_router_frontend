//sales_router_frontend/app/(dashboard)/dados/mapas/page.tsx

"use client";

import { useState, useEffect } from "react";
import { getUltimosJobsPDV, filtrarJobsPDV } from "@/services/pdv";
import { MapPinned } from "lucide-react";

export default function DadosMapasPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [filtrado, setFiltrado] = useState<any[] | null>(null);

  // Filtros
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  // Carregar últimos 20
  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const r = await getUltimosJobsPDV();   // <<< CORRETO
    setLista(r.jobs || []);
    setFiltrado(null);
  }

  async function aplicarFiltro() {
    const r = await filtrarJobsPDV({
      data_inicio: dataInicio || undefined,
      data_fim: dataFim || undefined,
      descricao: descricao || undefined,
    });

    setFiltrado(r.jobs || []);
  }

  const dados = filtrado ?? lista;

  return (
    <div className="max-w-6xl mx-auto px-4">

      <h1 className="text-4xl font-bold text-brand mb-10 flex items-center gap-3">
        <MapPinned className="text-brand h-10 w-10" />
        Dados → Mapas
      </h1>

      {/* FILTROS */}
      <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border">
        <h2 className="text-2xl font-semibold text-brand mb-6">
          Filtrar Processamentos
        </h2>

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
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <button
            onClick={aplicarFiltro}
            className="bg-brand text-white p-3 rounded-lg shadow hover:bg-brand-dark"
          >
            Filtrar
          </button>

          <button
            onClick={() => {
              setDataInicio("");
              setDataFim("");
              setDescricao("");
              setFiltrado(null);
            }}
            className="bg-gray-300 text-gray-700 p-3 rounded-lg shadow hover:bg-gray-400"
          >
            Limpar filtro
          </button>

        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-2xl shadow-xl p-10 border">
        <h2 className="text-2xl font-semibold text-brand mb-6">
          Últimos Processamentos
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 border-b">
              <tr>
                <th className="py-3 px-3 text-left">Descrição</th>
                <th className="py-3 px-3 text-left">Input ID</th>
                <th className="py-3 px-3 text-left">Status</th>
                <th className="py-3 px-3 text-center">Data</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {dados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-6">
                    Nenhum processamento encontrado.
                  </td>
                </tr>
              )}

              {dados.map((job) => (
                <tr key={job.job_id} className="border-b hover:bg-blue-50/40">
                  
                  <td className="py-3 px-3 font-medium">{job.descricao}</td>
                  <td className="py-3 px-3 font-mono text-xs">{job.input_id}</td>
                  <td className="py-3 px-3">{job.status}</td>

                  <td className="py-3 px-3 text-center">
                    {job.criado_em
                      ? new Date(job.criado_em).toLocaleString("pt-BR")
                      : "--"}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      className="text-brand hover:text-brand-dark px-3 py-1 border border-brand rounded-md"
                      onClick={() =>
                        (window.location.href = `/dados/mapas/${job.input_id}`)
                      }
                    >
                      Ver mapa
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
