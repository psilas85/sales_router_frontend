//sales_router_frontend/types/pdv.ts

export interface PDVLocal {
  id: number;
  cnpj: string;
  logradouro: string;
  numero: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  pdv_endereco_completo: string;
  pdv_lat: number | null;
  pdv_lon: number | null;
}

export interface BuscarLocaisResponse {
  total: number;
  pdvs: PDVLocal[];
}

export interface EditarLocalPayload {
  id: number;
  logradouro: string;
  numero: string | null;
  bairro: string;
  cidade: string;
  cep: string;
  pdv_lat: number | null;
  pdv_lon: number | null;
}
