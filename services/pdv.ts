//sales_router_frontend/services/pdv.ts

"use client";

// ============================================================
// 📦 PDV SERVICE — LIMPO, CONSISTENTE E FUNCIONAL
// ============================================================

import api from "./api";

// ============================================================
// UTIL — SANITIZAR UUID (REMOVE TAB / ESPAÇO INVISÍVEL)
// ============================================================

function sanitizeUUID(value?: string) {
  if (!value) return value;
  return value.replace(/\s+/g, "");
}

// ============================================================
// TIPAGEM
// ============================================================

export interface PDVLocal {
  id: number;
  cnpj: string;

  endereco_completo?: string;
  pdv_endereco_completo?: string;

  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;

  pdv_lat: number;
  pdv_lon: number;
}

export interface PDVLocalEdicao {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  pdv_lat: number;
  pdv_lon: number;
}

// ============================================================
// UPLOAD CSV
// ============================================================

export async function uploadPDV(file: File, descricao: string) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/pdv/upload-file", formData, {
    params: { descricao },
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

// ============================================================
// JOBS
// ============================================================

export async function getUltimosJobsPDV(params?: {
  limit?: number;
  offset?: number;
}) {
  const res = await api.get("/pdv/jobs/ultimos", { params });
  return res.data;
}


export async function listarJobs() {
  const res = await api.get("/pdv/jobs");
  return res.data;
}

export async function filtrarJobsPDV(params: {
  data_inicio?: string;
  data_fim?: string;
  descricao?: string;
}) {
  const res = await api.get("/pdv/jobs/filtrar", { params });
  return res.data;
}

export async function progressoJob(job_id: string) {
  const res = await api.get(`/pdv/jobs/${job_id}/progress`);
  return res.data;
}

export async function downloadInvalidos(job_id: string) {
  const res = await api.get(`/pdv/jobs/${job_id}/download-invalidos`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invalidos_${job_id}.csv`;
  a.click();
}

// ============================================================
// LOCAIS — BUSCA
// ============================================================

export async function buscarLocais(params: any): Promise<{
  total: number;
  pdvs: PDVLocal[];
}> {
  const cleanParams = {
    ...params,
    input_id: sanitizeUUID(params.input_id),
  };

  const res = await api.get("/pdv/locais", { params: cleanParams });

  return {
    total: res.data.total,
    pdvs: res.data.pdvs || [],
  };
}

// ============================================================
// LOCAIS — EDIÇÃO / EXCLUSÃO
// ============================================================

export async function editarLocal(
  data: PDVLocalEdicao
): Promise<PDVLocalEdicao | null> {
  const res = await api.put(`/pdv/locais/${data.id}`, data);

  const pdv = res.data?.pdv;
  if (!pdv) return null;

  return {
    id: pdv.id,
    logradouro: pdv.logradouro || "",
    numero: pdv.numero || "",
    bairro: pdv.bairro || "",
    cidade: pdv.cidade || "",
    uf: pdv.uf || "",
    cep: pdv.cep || "",
    pdv_lat: Number(pdv.pdv_lat),
    pdv_lon: Number(pdv.pdv_lon),
  };
}

export async function excluirLocal(id: number) {
  const res = await api.delete(`/pdv/locais/${id}`);
  return res.data;
}

// ============================================================
// MAPAS
// ============================================================

export async function gerarMapa(
  input_id: string,
  uf?: string,
  cidade?: string
) {
  const params: any = {
    input_id: sanitizeUUID(input_id),
  };
  if (uf) params.uf = uf;
  if (cidade) params.cidade = cidade;

  const res = await api.post("/pdv/gerar-mapa", null, { params });
  return res.data;
}

export async function baixarMapa(
  input_id: string,
  uf?: string,
  cidade?: string
) {
  const params: any = {
    input_id: sanitizeUUID(input_id),
  };
  if (uf) params.uf = uf;
  if (cidade) params.cidade = cidade;

  const res = await api.get("/pdv/download-mapa", {
    params,
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pdvs_${input_id}_${cidade || uf || "BR"}.html`;
  a.click();
}

// ============================================================
// JOB — DETALHAR
// ============================================================

export async function detalharJob(job_id: string) {
  const res = await api.get(`/pdv/jobs/${job_id}`);
  return res.data;
}

export function abrirMapaNavegador(url: string) {
  window.open(url, "_blank");
}
