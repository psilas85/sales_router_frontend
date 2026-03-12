//sales_router_frontend/services/locais.ts

import api from "./api";

export async function listarLocais(input_id: string) {
  const res = await api.get(`/pdv/locais`, { params: { input_id } });
  return res.data;
}
