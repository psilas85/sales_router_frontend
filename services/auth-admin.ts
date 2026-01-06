//sales_router_frontend/src/api/auth-admin.ts

import api from "./api";

// =======================
// TENANTS
// =======================

export const listarTenants = async () => {
  const res = await api.get("/auth/tenants");
  return res.data.tenants;
};

export const criarTenant = async (payload: {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email_adm: string;
}) => {
  const res = await api.post("/auth/tenants", null, {
    params: payload,
  });
  return res.data;
};

// =======================
// USUÁRIOS
// =======================

export const listarUsuarios = async () => {
  const res = await api.get("/auth/users");
  return res.data.users;
};

// ✅ CRIAR USUÁRIO — QUERY PARAMS (OBRIGATÓRIO)
export const criarUsuario = async (payload: {
  nome: string;
  email: string;
  senha: string;
  role: "tenant_adm" | "tenant_operacional";
  tenant_id: number;
}) => {
  const res = await api.post("/auth/users", payload);
  return res.data;
};


export const desativarUsuario = async (userId: number) => {
  const res = await api.put(`/auth/users/${userId}/deactivate`);
  return res.data;
};

export const ativarUsuario = async (userId: number) => {
  const res = await api.put(`/auth/users/${userId}/activate`);
  return res.data;
};

// ✅ UPDATE USA JSON BODY (CORRETO)
export const atualizarUsuario = async (
  userId: number,
  payload: {
    nome: string;
    email: string;
    role: string;
    senha?: string;
  }
) => {
  const body: any = {
    nome: payload.nome,
    email: payload.email,
    role: payload.role,
  };

  if (payload.senha && payload.senha.trim() !== "") {
    body.senha = payload.senha;
  }

  const res = await api.patch(`/auth/users/${userId}`, body);
  return res.data;
};

