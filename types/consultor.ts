// sales_router_frontend/types/consultor.ts

export interface Consultor {
  id: string;
  setor: string;
  consultor: string;
  cpf: string;

  logradouro: string;
  numero: string | null;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;

  celular?: string | null;
  email?: string | null;

  criado_em: string;
  atualizado_em: string;
}