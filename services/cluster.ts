//sales_router_frontend/services/cluster.ts

import api from "./api";

// ============================
// Criar Clusterização
// ============================
export async function criarClusterizacao(payload: any) {
  const res = await api.post("/cluster/clusterizar", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// ============================
// Listar inputs disponíveis
// ============================
export async function listarInputs(params?: {
  limit?: number;
  offset?: number;
  data_inicio?: string;
  data_fim?: string;
  descricao?: string;
}) {
  const r = await api.get("/cluster/inputs", {
    params,
  });
  return r.data;
}


// ============================
// Listar jobs de clusterização
// ============================
export async function listarClusterJobs(params?: {
  data_inicio?: string;
  data_fim?: string;
  descricao?: string;
  limit?: number;
  offset?: number;
}) {
  const res = await api.get("/cluster/jobs", { params });
  return res.data; // { total, jobs }
}

// ============================
// Gerar Mapa (FIX 422)
// ============================
export async function gerarMapa(clusterization_id: string) {
  const res = await api.post(
    "/cluster/mapa",
    {}, // ⚠️ nunca null
    { params: { clusterization_id } }
  );
  return res.data;
}

// ============================
// Exportar resumo
// ============================
export async function exportarResumo(clusterization_id: string) {
  const res = await api.get("/cluster/export/resumo", {
    params: { clusterization_id },
  });
  return res.data;
}

// ============================
// Exportar detalhado
// ============================
export async function exportarDetalhado(clusterization_id: string) {
  const res = await api.get("/cluster/export/detalhado", {
    params: { clusterization_id },
  });
  return res.data;
}

// ============================
// Histórico real de clusterizações (MAPAS / RELATÓRIOS)
// ============================
export async function listarHistoricoClusterizacoes(params?: {
  data_inicio?: string;
  data_fim?: string;
  descricao?: string;
  limit?: number;
  offset?: number;
}) {
  const res = await api.get("/cluster/historico", { params });
  return res.data; // { total, clusterizacoes }
}



