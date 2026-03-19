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
    lat: "",
    lon: "",
  });

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function validar() {

    if (!form.lat || !form.lon) {
      alert("Lat e Lon são obrigatórios");
      return false;
    }

    const lat = parseFloat(form.lat);
    const lon = parseFloat(form.lon);

    if (isNaN(lat) || isNaN(lon)) {
      alert("Lat/Lon inválidos");
      return false;
    }

    return true;
  }

  async function salvar() {

    if (!validar()) return;

    try {

      setSaving(true);

      await criarConsultor({
        ...form,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
      });

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

        <input name="consultor" value={form.consultor} onChange={handleChange} placeholder="Nome do consultor" className="input-base" />

        <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF (11 dígitos)" className="input-base" />

        <input name="setor" value={form.setor} onChange={handleChange} placeholder="Setor" className="input-base" />

        <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP (8 dígitos)" className="input-base" />

        <input name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Logradouro" className="input-base" />

        <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" className="input-base" />

        <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className="input-base" />

        <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="input-base" />

        <input name="uf" value={form.uf} onChange={handleChange} placeholder="UF" className="input-base" />

        {/* 🔥 NOVO */}
        <div className="grid grid-cols-2 gap-3">
          <input name="lat" value={form.lat} onChange={handleChange} placeholder="Latitude (-23.55...)" className="input-base" />
          <input name="lon" value={form.lon} onChange={handleChange} placeholder="Longitude (-46.63...)" className="input-base" />
        </div>

      </div>

      <div className="flex gap-3">

        <button
          onClick={salvar}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? "Salvando..." : "Criar consultor"}
        </button>

        <button
          onClick={() => router.push("/cadastros/consultores")}
          className="btn-secondary"
        >
          Cancelar
        </button>

      </div>

    </div>
  );
}