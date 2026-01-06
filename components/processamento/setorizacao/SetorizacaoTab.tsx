//sales_router_frontend/components/processamento/setorizacao/SetorizacaoTab.tsx

"use client";

import { useState } from "react";
import NovaSetorizacao from "./NovaSetorizacao";
import MapasSetorizacao from "./MapasSetorizacao";
import RelatoriosSetorizacao from "./RelatoriosSetorizacao";

export default function SetorizacaoTab() {
  const [aba, setAba] = useState<"nova" | "mapas" | "relatorios">("nova");

  return (
    <div className="space-y-4">
      {/* ABAS INTERNAS (compactas) */}
      <div className="flex gap-6 border-b text-sm">
        {[
          { id: "nova", label: "Nova" },
          { id: "mapas", label: "Mapas" },
          { id: "relatorios", label: "Relatórios" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setAba(item.id as any)}
            className={`pb-2 ${
              aba === item.id
                ? "text-brand font-semibold border-b-2 border-brand"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      <div>
        {aba === "nova" && <NovaSetorizacao />}
        {aba === "mapas" && <MapasSetorizacao />}
        {aba === "relatorios" && <RelatoriosSetorizacao />}
      </div>
    </div>
  );
}
