//sales_router_frontend/app/(dashboard)/processos-avulsos/page.tsx

"use client"

import { useState } from "react"
import Title from "@/components/Title"
import GeocodeEndereco from "@/components/processos-avulsos/geocoding/GeocodeEndereco"
import GeocodePlanilha from "@/components/processos-avulsos/geocoding/GeocodePlanilha"

export default function Page(){

  const [tab,setTab] = useState("endereco")

  return(

    <div className="p-6">

      <Title>Processos Avulsos</Title>

      <div className="flex gap-6 border-b mt-6">

        <button
          onClick={()=>setTab("endereco")}
          className={tab==="endereco"?"border-b-2 border-blue-600 pb-2":""}
        >
          Geolocalização
        </button>

        <button
          onClick={()=>setTab("planilha")}
          className={tab==="planilha"?"border-b-2 border-blue-600 pb-2":""}
        >
          Geolocalização por Planilha
        </button>

      </div>

      <div className="mt-6">

        {tab==="endereco" && <GeocodeEndereco/>}
        {tab==="planilha" && <GeocodePlanilha/>}

      </div>

    </div>

  )

}