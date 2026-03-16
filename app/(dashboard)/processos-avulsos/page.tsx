//sales_router_frontend/app/(dashboard)/processos-avulsos/page.tsx

// sales_router_frontend/app/(dashboard)/processos-avulsos/page.tsx

"use client"

import Title from "@/components/Title"
import GeocodePlanilha from "@/components/processos-avulsos/geocoding/GeocodePlanilha"

export default function Page() {

  return (

    <div className="p-6">

      <Title>Processos Avulsos</Title>

      <div className="mt-6">

        <GeocodePlanilha />

      </div>

    </div>

  )

}