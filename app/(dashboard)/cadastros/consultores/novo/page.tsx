"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import { criarConsultor } from "@/services/consultores";
import { geocodeEndereco } from "@/services/geocoding";

export default function NovoConsultorPage() {

  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

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

  function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
  }

  // =========================
  // 🔥 GEOCODIFICAR
  // =========================
  async function handleGeocodificar() {

    if (!form.logradouro || !form.numero || !form.cidade || !form.uf) {
      alert("Preencha endereço completo antes de geocodificar");
      return;
    }

    try {

      setGeoLoading(true);

      const res = await geocodeEndereco({
        endereco: `${form.logradouro}, ${form.numero}`,
        cidade: form.cidade,
        uf: form.uf,
      });

      if (res.status !== "ok") {
        alert("Endereço não encontrado");
        return;
      }

      setForm((prev) => ({
        ...prev,
        lat: String(res.lat),
        lon: String(res.lon),
      }));

    } catch (err) {
      console.error(err);
      alert("Erro ao geocodificar");
    } finally {
      setGeoLoading(false);
    }
  }

  function validar() {

    if (!form.lat || !form.lon) {
      alert("Clique em GEOCODIFICAR antes de salvar");
      return false;
    }

    const lat = parseFloat(form.lat);
    const lon = parseFloat(form.lon);

    if (isNaN(lat) || isNaN(lon)) {
      alert("Lat/Lon inválidos");
      return false;
    }

    if (onlyNumbers(form.cpf).length !== 11) {
      alert("CPF inválido");
      return false;
    }

    if (onlyNumbers(form.cep).length !== 8) {
      alert("CEP inválido");
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
        cpf: onlyNumbers(form.cpf),
        cep: onlyNumbers(form.cep),
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

        <input name="consultor" value={form.consultor} onChange={handleChange} placeholder="Nome" className="input-base" />

        <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF" className="input-base" />

        <input name="setor" value={form.setor} onChange={handleChange} placeholder="Setor" className="input-base" />

        <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" className="input-base" />

        <input name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Logradouro" className="input-base" />

        <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" className="input-base" />

        <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className="input-base" />

        <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="input-base" />

        <input name="uf" value={form.uf} onChange={handleChange} placeholder="UF" className="input-base" />

        {/* 🔥 BOTÃO GEOCODIFICAR */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGeocodificar}
            disabled={geoLoading}
            className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
          >
            {geoLoading ? "Geocodificando..." : "Geocodificar endereço"}
          </button>
        </div>

        {/* 🔥 LAT LON BLOQUEADO */}
        <div className="grid grid-cols-2 gap-3">
          <input
            name="lat"
            value={form.lat}
            readOnly
            className="input-base bg-gray-100"
            placeholder="Latitude"
          />
          <input
            name="lon"
            value={form.lon}
            readOnly
            className="input-base bg-gray-100"
            placeholder="Longitude"
          />
        </div>

      </div>

      <div className="flex gap-3">

        <button onClick={salvar} disabled={saving} className="btn-primary">
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