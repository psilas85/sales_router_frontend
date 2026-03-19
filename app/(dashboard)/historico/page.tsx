"use client";

import { useEffect, useState } from "react";
import Title from "@/components/Title";
import HistoricoTable from "@/components/historico/HistoricoTable";
import {
  listarHistoricoProcessamentos,
  TipoProcessamento,
  FiltrosHistorico,
} from "@/services/historico";

const PAGE_SIZE = 10;

type FiltrosUI = Omit<FiltrosHistorico, "limit" | "offset">;

export default function HistoricoPage() {
  const [dados, setDados] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filtrosDraft, setFiltrosDraft] = useState<FiltrosUI>({});
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosUI>({});

  async function carregar(p = pagina, filtros = filtrosAplicados) {
    setLoading(true);
    try {
      const res = await listarHistoricoProcessamentos({
        limit: PAGE_SIZE,
        offset: p * PAGE_SIZE,
        ...filtros,
      });

      setDados(res.dados);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }

  function aplicarFiltros() {
    setPagina(0);
    setFiltrosAplicados({ ...filtrosDraft });
  }

  function limparFiltros() {
    setFiltrosDraft({});
    setFiltrosAplicados({});
    setPagina(0);
  }

  useEffect(() => {
    carregar(pagina, filtrosAplicados);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, filtrosAplicados]);

  return (
    <>
      <Title>Histórico</Title>

      {/* FILTROS */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-7 gap-4">
        <input
          type="date"
          value={filtrosDraft.data_inicio ?? ""}
          onChange={(e) =>
            setFiltrosDraft({
              ...filtrosDraft,
              data_inicio: e.target.value || undefined,
            })
          }
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={filtrosDraft.data_fim ?? ""}
          onChange={(e) =>
            setFiltrosDraft({
              ...filtrosDraft,
              data_fim: e.target.value || undefined,
            })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Descrição contém..."
          value={filtrosDraft.descricao ?? ""}
          onChange={(e) =>
            setFiltrosDraft({
              ...filtrosDraft,
              descricao: e.target.value || undefined,
            })
          }
          className="border p-2 rounded"
        />

        <select
          value={filtrosDraft.tipo ?? ""}
          onChange={(e) =>
            setFiltrosDraft({
              ...filtrosDraft,
              tipo: e.target.value
                ? (e.target.value as TipoProcessamento)
                : undefined,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">Todos</option>
          <option value="Upload">Upload</option>
          <option value="Setorização">Setorização</option>
          <option value="Roteirização">Roteirização</option>
        </select>

        <select
          value={filtrosDraft.status ?? ""}
          onChange={(e) =>
            setFiltrosDraft({
              ...filtrosDraft,
              status: e.target.value || undefined,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">Status</option>
          <option value="queued">Na fila</option>
          <option value="running">Em processamento</option>
          <option value="done">Concluído</option>
          <option value="error">Erro</option>
        </select>

        <button
          onClick={aplicarFiltros}
          className="bg-brand text-white rounded px-4"
        >
          Filtrar
        </button>

        <button
          onClick={limparFiltros}
          className="bg-gray-200 text-gray-700 rounded px-4"
        >
          Limpar
        </button>
      </div>

      {/* TABELA + PAGINAÇÃO CENTRALIZADA */}
      <HistoricoTable
        dados={dados}
        loading={loading}
        page={pagina + 1}
        total={total}
        limit={PAGE_SIZE}
        onPageChange={(p) => setPagina(p - 1)}
      />
    </>
  );
}