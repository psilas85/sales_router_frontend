//sales_router_frontend/services/auth.ts

import api from "./api";

// LOGIN correto com JSON body
export async function login(email: string, senha: string) {
  const res = await api.post("/auth/login", {
    email,
    senha,
  });

  return res.data.token;
}

// /auth/me retorna user inteiro
export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}
