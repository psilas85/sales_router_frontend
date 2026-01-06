//sales_router_frontend/src/services/historico.ts

import { listarHistoricoClusterizacoes } from "@/services/cluster";
import { listarRelatoriosRoteirizacao } from "@/services/routing";
import { getUltimosJobsPDV } from "@/services/pdv";

export type TipoProcessamento = "Upload" | "Setorização" | "Roteirização";

export type FiltrosHistorico = {
  limit: number;
  offset: number;
  data_inicio?: string; // yyyy-mm-dd
  data_fim?: string;    // yyyy-mm-dd
  descricao?: string;
  tipo?: TipoProcessamento;
  status?: string;
};

// ===============================
// Utils: converte timestamp -> "YYYY-MM-DD" em America/Sao_Paulo
// (critério do usuário no Brasil, independente do timezone do dado)
// ===============================
const TZ = "America/Sao_Paulo";

function dateKeyBR(value: any): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const year = parts.find((p) => p.type === "year")?.value ?? "0000";
  const month = parts.find((p) => p.type === "month")?.value ?? "00";
  const day = parts.find((p) => p.type === "day")?.value ?? "00";
  return `${year}-${month}-${day}`; // lexicográfico funciona
}

function safeLower(s: any) {
  return (s ?? "").toString().toLowerCase();
}

// ===============================
// Service
// ===============================
export async function listarHistoricoProcessamentos(params: FiltrosHistorico) {
  const [pdvResp, clusterResp, routingResp] = await Promise.all([
    // ---------------- PDV ----------------
    params.tipo && params.tipo !== "Upload"
      ? Promise.resolve({ jobs: [] })
      : getUltimosJobsPDV().catch(() => ({ jobs: [] })),

    // ------------ SETORIZAÇÃO ------------
    params.tipo === "Roteirização"
      ? Promise.resolve({ clusterizacoes: [] })
      : listarHistoricoClusterizacoes({
          limit: params.limit,
          offset: params.offset,
          data_inicio: params.data_inicio,
          data_fim: params.data_fim,
          descricao: params.descricao,
        }).catch(() => ({ clusterizacoes: [] })),

    // ------------ ROTEIRIZAÇÃO ------------
    params.tipo === "Setorização"
      ? Promise.resolve({ roteirizacoes: [] })
      : listarRelatoriosRoteirizacao({
          limit: params.limit,
          offset: params.offset,
          data_inicio: params.data_inicio,
          data_fim: params.data_fim,
          descricao: params.descricao,
        }).catch(() => ({ roteirizacoes: [] })),
  ]);

  // ===============================
  // Unificação
  // ===============================
  let dados = [
    ...(pdvResp.jobs ?? []).map((j: any) => ({
      id: j.job_id,
      tipo: "Upload" as const,
      data: j.criado_em,
      descricao: j.descricao ?? "-",
      status: j.status ?? "done",
    })),

    ...(clusterResp.clusterizacoes ?? []).map((c: any) => ({
      id: c.clusterization_id,
      tipo: "Setorização" as const,
      data: c.criado_em,
      descricao: c.descricao ?? "-",
      status: c.status ?? "done",
    })),

    ...(routingResp.roteirizacoes ?? []).map((r: any) => ({
      id: r.routing_id,
      tipo: "Roteirização" as const,
      data: r.criado_em,
      descricao: r.descricao ?? "-",
      status: r.status ?? "done",
    })),
  ];

  // ===============================
  // Filtros globais (pela data do Brasil)
  // ===============================

  // ---- filtro data (INCLUSIVO nos dois lados)
  if (params.data_inicio || params.data_fim) {
    const ini = params.data_inicio ?? "";
    const fim = params.data_fim ?? "";

    dados = dados.filter((d) => {
      const key = dateKeyBR(d.data);
      if (!key) return false;

      if (ini && key < ini) return false;
      if (fim && key > fim) return false;

      return true;
    });
  }

  // ---- filtro descricao
  if (params.descricao) {
    const termo = safeLower(params.descricao).trim();
    if (termo) {
      dados = dados.filter((d) => safeLower(d.descricao).includes(termo));
    }
  }

  // ---- filtro tipo
  if (params.tipo) {
    dados = dados.filter((d) => d.tipo === params.tipo);
  }

  // ---- filtro status
  if (params.status) {
    dados = dados.filter((d) => d.status === params.status);
  }

  // ===============================
  // Ordenação global (timestamp real)
  // ===============================
  dados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // ===============================
  // Paginação final
  // ===============================
  const inicio = params.offset ?? 0;
  const fim = inicio + params.limit;

  return {
    dados: dados.slice(inicio, fim),
    total: dados.length,
  };
}
