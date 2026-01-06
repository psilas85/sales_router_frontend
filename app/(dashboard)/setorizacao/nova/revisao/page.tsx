//sales_router_frontend/app/%28dashboard%29/setorizacao/nova/revisao/page.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Title from "../../../../../components/Title";
import { criarClusterizacao } from "../../../../../services/cluster";

export default function RevisaoClusterizacao() {
  const router = useRouter();
  const p = useSearchParams();

  async function enviar() {
    const params: any = {
      uf: p.get("uf"),
      cidade: p.get("cidade"),
      descricao: p.get("descricao"),
      input_id: p.get("input_id"),
      algo: p.get("algo"),
      max_pdv_cluster: p.get("max"),
      workday: p.get("workday"),
      routekm: p.get("routekm"),
      service: p.get("service"),
      vel: p.get("vel"),
      alpha: p.get("alpha"),
    };

    const resp = await criarClusterizacao(params);
    router.push("/dashboard/setorizacao/consultas");
  }

  return (
    <div className="p-8">
      <Title>Clusterização — Revisão Final</Title>

      <div className="bg-white rounded-2xl shadow p-6">
        {Array.from(p.entries()).map(([k, v]) => (
          <p key={k} className="mb-1">
            <b>{k}</b>: {v}
          </p>
        ))}

        <button
          onClick={enviar}
          className="mt-6 bg-brand text-white px-6 py-3 rounded-lg shadow hover:opacity-90"
        >
          🚀 Iniciar Clusterização
        </button>
      </div>
    </div>
  );
}
