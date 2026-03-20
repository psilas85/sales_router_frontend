// sales_router_frontend/app/(dashboard)/processos-avulsos/roteirizacao/page.tsx

import RoutingPlanilha from "@/components/processos-avulsos/routing/RoutingPlanilha"
import Title from "@/components/Title"

export default function Page() {
  return (
    <div className="p-6">
      <Title>Execução Operacional</Title>
      <RoutingPlanilha />
    </div>
  )
}