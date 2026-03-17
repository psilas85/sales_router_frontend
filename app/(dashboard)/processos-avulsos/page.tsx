//sales_router_frontend/app/(dashboard)/processos-avulsos/page.tsx

"use client"

import { useState } from "react"

import Title from "@/components/Title"
import GeocodePlanilha from "@/components/processos-avulsos/geocoding/GeocodePlanilha"
import EdicaoEnderecos from "@/components/processos-avulsos/geocoding/EdicaoEnderecos"

export default function Page() {

  const [tab, setTab] = useState("lote")

  return (

    <div className="p-6">

      <Title>Processos Avulsos</Title>

      {/* TABS */}
      <div className="flex gap-4 mt-6 border-b">

        <button
          onClick={() => setTab("lote")}
          className={`pb-2 ${tab === "lote" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
        >
          Geocodificação em Lote
        </button>

        <button
          onClick={() => setTab("edicao")}
          className={`pb-2 ${tab === "edicao" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
        >
          Edição de Endereços
        </button>

      </div>

      {/* CONTEÚDO */}
      <div className="mt-6">

        {tab === "lote" && <GeocodePlanilha />}
        {tab === "edicao" && <EdicaoEnderecos />}

      </div>

    </div>

  )

}