//sales_router_frontend/app/(dashboard)/processos-avulsos/page.tsx

"use client"

import { useState } from "react"

import Title from "@/components/Title"
import GeocodePlanilha from "@/components/processos-avulsos/geocoding/GeocodePlanilha"
import EdicaoEnderecos from "@/components/processos-avulsos/geocoding/EdicaoEnderecos"
import RoutingPlanilha from "@/components/processos-avulsos/routing/RoutingPlanilha"

export default function Page() {

  const [tab, setTab] = useState("geocode")

  return (

    <div className="p-6">

      <Title>Processos Avulsos</Title>

      {/* TABS */}
      <div className="flex gap-8 mt-8 border-b">

        <button
          onClick={() => setTab("geocode")}
          className={`pb-3 text-sm transition ${
            tab === "geocode"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Geocodificação em Lote
        </button>

        <button
          onClick={() => setTab("routing")}
          className={`pb-3 text-sm transition ${
            tab === "routing"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Roteirização
        </button>

        <button
          onClick={() => setTab("edicao")}
          className={`pb-3 text-sm transition ${
            tab === "edicao"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Edição de Endereços
        </button>

      </div>

      {/* CONTEÚDO */}
      <div className="mt-8">

        {tab === "geocode" && <GeocodePlanilha />}
        {tab === "routing" && <RoutingPlanilha />}
        {tab === "edicao" && <EdicaoEnderecos />}

      </div>

    </div>

  )

}