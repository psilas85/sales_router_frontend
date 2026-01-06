// sales_router_frontend/app/(dashboard)/processamento/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import EntradaDadosTab from "@/components/processamento/entrada-de-dados/EntradaDadosTab";
import SetorizacaoTab from "@/components/processamento/setorizacao/SetorizacaoTab";
import RoteirizacaoTab from "@/components/processamento/roteirizacao/RoteirizacaoTab";

type Aba = "entrada" | "setorizacao" | "roteirizacao";

export default function ProcessamentoPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Aba | null;

  const [tab, setTab] = useState<Aba>("setorizacao");

  useEffect(() => {
    if (
      tabParam === "entrada" ||
      tabParam === "setorizacao" ||
      tabParam === "roteirizacao"
    ) {
      setTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="px-6 pt-4 pb-6 space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">
        Processamento
      </h1>

      {/* ABAS */}
      <div className="flex gap-6 border-b text-sm">
        <button
          onClick={() => setTab("entrada")}
          className={`pb-2 ${
            tab === "entrada"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500"
          }`}
        >
          Entrada de Dados
        </button>

        <button
          onClick={() => setTab("setorizacao")}
          className={`pb-2 ${
            tab === "setorizacao"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500"
          }`}
        >
          Setorização
        </button>

        <button
          onClick={() => setTab("roteirizacao")}
          className={`pb-2 ${
            tab === "roteirizacao"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500"
          }`}
        >
          Roteirização
        </button>
      </div>

      {/* CONTEÚDO */}
      {tab === "entrada" && <EntradaDadosTab />}
      {tab === "setorizacao" && <SetorizacaoTab />}
      {tab === "roteirizacao" && <RoteirizacaoTab />}
    </div>
  );
}

