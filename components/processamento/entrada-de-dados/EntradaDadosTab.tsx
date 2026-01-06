// sales_router_frontend/components/processamento/entrada-de-dados/EntradaDadosTab.tsx

"use client";

import { useState } from "react";
import EntradaTab from "./EntradaTab";
import MapaTab from "./MapaTab";
import LocaisTab from "./LocaisTab";

type Aba = "upload" | "mapa" | "locais";

export default function EntradaDadosTab() {
  const [aba, setAba] = useState<Aba>("upload");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Entrada de Dados
        </h1>
        <p className="text-xs text-gray-500">
          Upload, validação e visualização dos dados de entrada
        </p>
      </div>

      {/* ABAS */}
      <div className="flex gap-6 border-b text-sm">
        {[
          { key: "upload", label: "Upload" },
          { key: "mapa", label: "Mapa" },
          { key: "locais", label: "Locais" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setAba(t.key as Aba)}
            className={`pb-2 transition ${
              aba === t.key
                ? "text-brand font-semibold border-b-2 border-brand"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      <div className="pt-2">
        {aba === "upload" && <EntradaTab />}
        {aba === "mapa" && <MapaTab />}
        {aba === "locais" && <LocaisTab />}
      </div>
    </div>
  );
}
