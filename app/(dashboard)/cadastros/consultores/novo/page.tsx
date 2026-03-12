//sales_router_frontend/app/(dashboard)/cadastros/consultores/novo/page.tsx

"use client";

import { useState } from "react";
import { criarConsultor } from "@/services/consultores";
import Title from "@/components/Title";

export default function NovoConsultorPage() {

  const [form, setForm] = useState({
    consultor: "",
    cpf: "",
    setor: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
  });

  async function salvar() {

    await criarConsultor(form);

    window.location.href = "/cadastros/consultores";
  }

  return (
    <div className="p-8 space-y-6">

      <Title>Novo Consultor</Title>

      <div className="bg-white rounded-2xl border shadow-sm p-6 grid grid-cols-2 gap-4">

        <input
          placeholder="Nome"
          value={form.consultor}
          onChange={(e) =>
            setForm({ ...form, consultor: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="CPF"
          value={form.cpf}
          onChange={(e) =>
            setForm({ ...form, cpf: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Setor"
          value={form.setor}
          onChange={(e) =>
            setForm({ ...form, setor: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Cidade"
          value={form.cidade}
          onChange={(e) =>
            setForm({ ...form, cidade: e.target.value })
          }
          className="border p-2 rounded"
        />

        <button
          onClick={salvar}
          className="col-span-full bg-brand text-white rounded p-2"
        >
          Salvar
        </button>

      </div>

    </div>
  );
}