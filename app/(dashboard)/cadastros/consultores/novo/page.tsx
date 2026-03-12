//sales_router_frontend/app/(dashboard)/cadastros/consultores/novo/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import { criarConsultor } from "@/services/consultores";

export default function NovoConsultorPage() {

  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    consultor: "",
    cpf: "",
    setor: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  function handleChange(e: any) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function salvar() {

    try {

      setSaving(true);

      await criarConsultor(form);

      alert("Consultor criado com sucesso");

      router.push("/cadastros/consultores");

    } catch (err) {

      console.error("Erro ao criar consultor", err);
      alert("Erro ao criar consultor");

    } finally {

      setSaving(false);
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-xl">

      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Voltar
      </button>

      <Title>Novo consultor</Title>

      <div className="bg-white rounded-xl border p-6 space-y-4">

        <input
          name="consultor"
          value={form.consultor}
          onChange={handleChange}
          placeholder="Nome do consultor"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="cpf"
          value={form.cpf}
          onChange={handleChange}
          placeholder="CPF"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="setor"
          value={form.setor}
          onChange={handleChange}
          placeholder="Setor"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="cep"
          value={form.cep}
          onChange={handleChange}
          placeholder="CEP"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="logradouro"
          value={form.logradouro}
          onChange={handleChange}
          placeholder="Logradouro"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="numero"
          value={form.numero}
          onChange={handleChange}
          placeholder="Número"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="bairro"
          value={form.bairro}
          onChange={handleChange}
          placeholder="Bairro"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="cidade"
          value={form.cidade}
          onChange={handleChange}
          placeholder="Cidade"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="uf"
          value={form.uf}
          onChange={handleChange}
          placeholder="UF"
          className="w-full border rounded-lg p-2 text-sm"
        />

      </div>

      <div className="flex gap-3">

        <button
          onClick={salvar}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Criar consultor"}
        </button>

        <button
          onClick={() => router.push("/cadastros/consultores")}
          className="border px-4 py-2 rounded-lg text-sm"
        >
          Cancelar
        </button>

      </div>

    </div>
  );
}