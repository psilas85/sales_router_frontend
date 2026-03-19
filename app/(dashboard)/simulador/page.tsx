"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import EntradaDadosTab from "@/components/processamento/entrada-de-dados/EntradaDadosTab";
import SetorizacaoTab from "@/components/processamento/setorizacao/SetorizacaoTab";
import RoteirizacaoTab from "@/components/processamento/roteirizacao/RoteirizacaoTab";
import HistoricoTable from "@/components/historico/HistoricoTable";

import {
  listarHistoricoProcessamentos
} from "@/services/historico";

type Aba =
  | "entrada"
  | "setorizacao"
  | "roteirizacao"
  | "historico";

export default function ProcessamentoPage() {

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Aba | null;

  const [tab, setTab] = useState<Aba>("setorizacao");

  const [dadosHistorico, setDadosHistorico] = useState<any[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (
      tabParam === "entrada" ||
      tabParam === "setorizacao" ||
      tabParam === "roteirizacao" ||
      tabParam === "historico"
    ) {
      setTab(tabParam);
    }
  }, [tabParam]);

  async function carregarHistorico(pageAtual = 1) {
    setLoadingHistorico(true);

    const offset = (pageAtual - 1) * limit;

    const res = await listarHistoricoProcessamentos({
      limit,
      offset,
    });

    setDadosHistorico(res.dados || []);
    setTotal(res.total || 0);
    setPage(pageAtual);

    setLoadingHistorico(false);
  }

  function handleTab(nova: Aba) {
    setTab(nova);

    if (nova === "historico") {
      carregarHistorico(1);
    }
  }

  return (
    <div className="px-6 pt-4 pb-6 space-y-4">

      <h1 className="text-xl font-semibold text-gray-900">
        Simulador
      </h1>

      {/* ABAS */}
      <div className="flex gap-6 border-b text-sm">

        <button
          onClick={() => handleTab("entrada")}
          className={`pb-2 ${
            tab === "entrada"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500"
          }`}
        >
          Entrada de Dados
        </button>

        <button
          onClick={() => handleTab("setorizacao")}
          className={`pb-2 ${
            tab === "setorizacao"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500"
          }`}
        >
          Setorização
        </button>

        <button
          onClick={() => handleTab("roteirizacao")}
          className={`pb-2 ${
            tab === "roteirizacao"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500"
          }`}
        >
          Roteirização
        </button>

        <button
          onClick={() => handleTab("historico")}
          className={`pb-2 ${
            tab === "historico"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500"
          }`}
        >
          Histórico
        </button>

      </div>

      {/* CONTEÚDO */}
      {tab === "entrada" && <EntradaDadosTab />}
      {tab === "setorizacao" && <SetorizacaoTab />}
      {tab === "roteirizacao" && <RoteirizacaoTab />}

      {tab === "historico" && (
        <HistoricoTable
          dados={dadosHistorico}
          loading={loadingHistorico}
          page={page}
          total={total}
          limit={limit}
          onPageChange={carregarHistorico}
        />
      )}

    </div>
  );
}