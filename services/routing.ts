// sales_router_frontend/services/routing.ts

import api from "./api";

// ============================================================
// 🚀 Iniciar Roteirização
// Backend deve retornar: { job_id }
// ============================================================
export async function iniciarRoteirizacao(payload: {
  clusterization_id: string;
  descricao: string;
  uf: string;
  cidade: string | null;
  dias_uteis: number;
  frequencia_visita: number;
  service_min: number;
  vel_kmh: number;
}) {
  const res = await api.post("/routing/roteirizar", payload, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data; // { job_id }
}

// ============================================================
// 📌 Listar setorizações finalizadas
// ============================================================
export async function listarClusterizacoes() {
  const res = await api.get("/routing/clusterizations");
  return res.data;
}

// ============================================================
// 📊 Status do Job de Roteirização
// Estrutura esperada:
// {
//   progress: 0–100,
//   status: "running" | "finished" | "failed",
//   message?: string
// }
// ============================================================
export async function statusRoteirizacao(job_id: string) {
  const res = await api.get(`/routing/status/${job_id}`);
  return res.data;
}

// ============================================================
// 📌 Listar execuções (runs) de roteirização
// ============================================================
export async function listarRuns() {
  const res = await api.get("/routing/runs");
  return res.data;
}

// ============================================================
// 📌 Listar execuções FINALIZADAS de roteirização (nome canônico)
// ============================================================
export async function listarRoteirizacoes() {
  const res = await api.get("/routing/runs");
  return res.data;
}


// alias mantido (caso já esteja sendo usado)
export async function listarRoutingRuns() {
  const res = await api.get("/routing/runs");
  return res.data;
}

// ============================================================
// 🗺️ Gerar mapa da roteirização
// ============================================================
export async function gerarMapaRoteirizacao(routing_id: string) {
  const res = await api.post("/routing/mapa", null, {
    params: { routing_id },
  });
  return res.data;
}

// ============================================================
// 📄 Exportações
// ============================================================
export async function exportarResumoRouting(routing_id: string) {
  const res = await api.post("/routing/relatorio/resumo", null, {
    params: { routing_id },
  });
  return res.data;
}

export async function exportarPDVsRouting(routing_id: string) {
  const res = await api.post("/routing/relatorio/pdvs", null, {
    params: { routing_id },
  });
  return res.data;
}


// ============================================================
// 📌 Relatórios de Roteirização (HISTÓRICO)
// ============================================================
export async function listarRelatoriosRoteirizacao(params: {
  data_inicio?: string;
  data_fim?: string;
  descricao?: string;
  limit: number;
  offset: number;
}) {
  const res = await api.get("/routing/relatorios", { params });
  return res.data;
}
