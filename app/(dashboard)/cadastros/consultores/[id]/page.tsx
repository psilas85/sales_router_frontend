//sales_router_frontend/app/(dashboard)/cadastros/consultores/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Title from "@/components/Title";
import { buscarConsultor, atualizarConsultor } from "@/services/consultores";

export default function EditarConsultorPage() {

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);

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

  async function carregar() {
    try {
      const data = await buscarConsultor(id);

      setForm({
        consultor: data.consultor || "",
        cpf: data.cpf || "",
        setor: data.setor || "",
        logradouro: data.logradouro || "",
        numero: data.numero || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        uf: data.uf || "",
        cep: data.cep || "",
      });

    } catch (err) {
      console.error("Erro ao carregar consultor", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function salvar() {

    await atualizarConsultor(id, form);

    router.push("/cadastros");
  }

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Carregando...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-xl">

      <Title>Editar consultor</Title>

      <div className="space-y-4">

        <input
          name="consultor"
          value={form.consultor}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          name="cpf"
          value={form.cpf}
          disabled
          className="w-full border rounded-lg p-2 text-sm bg-gray-100"
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Salvar
        </button>

        <button
          onClick={() => router.push("/cadastros")}
          className="border px-4 py-2 rounded-lg text-sm"
        >
          Cancelar
        </button>

      </div>

    </div>
  );
}