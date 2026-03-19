"use client";

import { useState } from "react";
import Title from "@/components/Title";
import HistoricoTable from "@/components/historico/HistoricoTable";

import {
  listarHistoricoProcessamentos,
  TipoProcessamento,
} from "@/services/historico";

type Aba = "simulacao" | "historico";

export default function SimuladorPage() {

  const [aba, setAba] = useState<Aba>("simulacao");

  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregarHistorico() {
    setLoading(true);

    const res = await listarHistoricoProcessamentos({
      limit: 20,
      offset: 0,
    });

    setDados(res.dados);
    setLoading(false);
  }

  function handleAba(nova: Aba) {
    setAba(nova);

    if (nova === "historico") {
      carregarHistorico();
    }
  }

  return (
    <>
      <Title>Simulador</Title>

      {/* ABAS */}
      <div className="flex gap-2 mb-4">

        <button
          onClick={() => handleAba("simulacao")}
          className={`px-4 py-2 rounded ${
            aba === "simulacao"
              ? "bg-brand text-white"
              : "bg-gray-100"
          }`}
        >
          Simulação
        </button>

        <button
          onClick={() => handleAba("historico")}
          className={`px-4 py-2 rounded ${
            aba === "historico"
              ? "bg-brand text-white"
              : "bg-gray-100"
          }`}
        >
          Histórico
        </button>

      </div>

      {/* CONTEÚDO */}
      {aba === "simulacao" && (
        <div className="bg-white p-6 rounded shadow">
          {/* aqui entra seu simulador atual */}
          Simulador (conteúdo atual)
        </div>
      )}

      {aba === "historico" && (
        <HistoricoTable dados={dados} loading={loading} />
      )}
    </>
  );
}