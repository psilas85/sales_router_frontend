//sales_router_frontend/components/processamento/roteirizacao/RoteirizacaoTab.tsx

"use client";

import { useState } from "react";
import NovaRoteirizacao from "./NovaRoteirizacao";
import MapasRoteirizacao from "./MapasRoteirizacao";
import RelatoriosRoteirizacao from "./RelatoriosRoteirizacao";

type Aba = "nova" | "mapas" | "relatorios";

export default function RoteirizacaoTab() {
  const [aba, setAba] = useState<Aba>("nova");

  return (
    <div className="space-y-6">
      {/* ABAS INTERNAS */}
      <div className="flex gap-6 border-b text-sm">
        <button
          onClick={() => setAba("nova")}
          className={`pb-2 ${
            aba === "nova"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Nova
        </button>

        <button
          onClick={() => setAba("mapas")}
          className={`pb-2 ${
            aba === "mapas"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Mapas
        </button>

        <button
          onClick={() => setAba("relatorios")}
          className={`pb-2 ${
            aba === "relatorios"
              ? "text-brand font-semibold border-b-2 border-brand"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Relatórios
        </button>
      </div>

      {/* CONTEÚDO */}
      <div>
        {aba === "nova" && <NovaRoteirizacao />}
        {aba === "mapas" && <MapasRoteirizacao />}
        {aba === "relatorios" && <RelatoriosRoteirizacao />}
      </div>
    </div>
  );
}
