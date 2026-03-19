"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Title from "@/components/Title";
import {
  buscarConsultor,
  atualizarConsultor,
} from "@/services/consultores";

export default function EditarConsultorPage() {

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
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

  function parseNumber(value: string) {
    return Number(value.replace(",", "."));
  }

  function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
  }

  async function carregar() {

    try {

      const data = await buscarConsultor(id);

      setForm({
        consultor: data.consultor || "",
        cpf: data.cpf || "",
        setor: data.setor || "",
        cep: data.cep || "",
        logradouro: data.logradouro || "",
        numero: data.numero || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        uf: data.uf || "",
        lat: data.lat?.toString() || "",
        lon: data.lon?.toString() || "",
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

  function validar() {

    const lat = parseNumber(form.lat);
    const lon = parseNumber(form.lon);

    if (isNaN(lat) || isNaN(lon)) {
      alert("Lat/Lon inválidos");
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

      console.log("ANTES DE ENVIAR:", form.lat, form.lon);
      console.log("PARSEADO:", parseNumber(form.lat), parseNumber(form.lon));

      await atualizarConsultor(id, {
        ...form,
        cpf: onlyNumbers(form.cpf),
        cep: onlyNumbers(form.cep),
        lat: parseNumber(form.lat),
        lon: parseNumber(form.lon),
      });

      alert("Consultor atualizado com sucesso");

      router.push("/cadastros/consultores");

    } catch (err) {

      console.error("Erro ao salvar", err);
      alert("Erro ao salvar consultor");

    } finally {

      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Carregando consultor...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-xl">

      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Voltar
      </button>

      <Title>Editar consultor</Title>

      <div className="bg-white rounded-xl border p-6 space-y-4">

        <input name="consultor" value={form.consultor} onChange={handleChange} placeholder="Nome do consultor" className="input-base" />

        <input name="cpf" value={form.cpf} disabled className="input-base bg-gray-100" />

        <input name="setor" value={form.setor} onChange={handleChange} placeholder="Setor" className="input-base" />

        <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" className="input-base" />

        <input name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Logradouro" className="input-base" />

        <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" className="input-base" />

        <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className="input-base" />

        <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="input-base" />

        <input name="uf" value={form.uf} onChange={handleChange} placeholder="UF" className="input-base" />

        <div className="grid grid-cols-2 gap-3">
          <input name="lat" value={form.lat} onChange={handleChange} placeholder="Latitude" className="input-base" />
          <input name="lon" value={form.lon} onChange={handleChange} placeholder="Longitude" className="input-base" />
        </div>

      </div>

      <div className="flex gap-3">

        <button onClick={salvar} disabled={saving} className="btn-primary">
          {saving ? "Salvando..." : "Salvar"}
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