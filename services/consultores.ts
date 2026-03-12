// sales_router_frontend/services/consultores.ts

import api from "./api";

export async function listarConsultores() {
  const res = await api.get("/consultores");
  return res.data;
}

export async function buscarConsultor(id: string) {
  const res = await api.get(`/consultores/${id}`);
  return res.data;
}

export async function criarConsultor(payload: any) {
  const res = await api.post("/consultores", payload);
  return res.data;
}

export async function atualizarConsultor(id: string, payload: any) {
  const res = await api.put(`/consultores/${id}`, payload);
  return res.data;
}

export async function deletarConsultor(id: string) {
  const res = await api.delete(`/consultores/${id}`);
  return res.data;
}