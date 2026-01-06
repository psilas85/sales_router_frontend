// sales_router_frontend/app/(dashboard)/roteirizacao/nova/parametros/page.tsx



"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Title from "@/components/Title";
import { iniciarRoteirizacao } from "@/services/routing";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoutingProgressStore } from "@/store/useRoutingProgressStore";

export default function ParametrosRoteirizacaoPage() {
  const params = useSearchParams();
  const router = useRouter();

  const clusterization_id = params.get("clusterization_id");
  const uf = params.get("uf") || "";
  const cidade = params.get("cidade") || null;

  const { user, token, loadUser } = useAuthStore();
  const { setJob, reset } = useRoutingProgressStore();

  // =============================
  // LOAD USER
  // =============================
  useEffect(() => {
    if (!token || !user) loadUser();
  }, []);

  if (!token || !user) {
    return <div className="p-8 text-gray-600">Carregando sessão...</div>;
  }

  // =============================
  // FORM
  // =============================
  const [loading, setLoading] = useState(false);
  const [descricao, setDescricao] = useState("");

  const [diasUteis, setDiasUteis] = useState(1);
  const [freq, setFreq] = useState(1);
  const [serviceMin, setServiceMin] = useState(5);
  const [velMedia, setVelMedia] = useState(30);

  // UI only (não enviados)
  const [maxKm, setMaxKm] = useState(250);
  const [maxMin, setMaxMin] = useState(480);

  if (!clusterization_id) {
    return (
      <div className="p-8 text-red-600">
        ❌ Erro: clusterization_id não informado.
      </div>
    );
  }

  // =============================
  // INICIAR ROTEIRIZAÇÃO
  // =============================
  async function iniciar() {
    if (!descricao.trim()) {
      alert("Informe uma descrição para a roteirização.");
      return;
    }

    if (descricao.length > 60) {
      alert("A descrição deve ter no máximo 60 caracteres.");
      return;
    }

    setLoading(true);

    try {
      reset(); // limpa progresso anterior

      const resp = await iniciarRoteirizacao({
        clusterization_id,
        descricao,
        uf,
        cidade,
        dias_uteis: diasUteis,
        frequencia_visita: freq,
        service_min: serviceMin,
        vel_kmh: velMedia,
      });


      // **É obrigatório que o backend retorne: { job_id }**
      if (!resp.job_id) {
        alert("Erro: backend não retornou job_id.");
        console.error("Resposta da API:", resp);
        return;
      }

      // salva job no Zustand
      setJob(resp.job_id);

      // redireciona para tela de progresso
      router.push("/roteirizacao/progresso");

    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar roteirização.");
    } finally {
      setLoading(false);
    }
  }

  // =============================
  // UI
  // =============================
  return (
    <div className="p-8">
      <Title>Nova Roteirização – Parâmetros</Title>

      <p className="text-gray-600 mb-6">
        Configure os parâmetros abaixo para gerar as rotas do cluster selecionado.
      </p>

      <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">
        <h2 className="text-xl font-semibold mb-6">Parâmetros</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Clusterization ID */}
          <div className="md:col-span-2">
            <label className="font-medium">Clusterization ID</label>
            <input
              type="text"
              readOnly
              value={clusterization_id}
              className="border p-3 rounded-lg w-full mt-1 bg-gray-100 font-mono text-xs"
            />
          </div>

          {/* UF */}
          <div>
            <label className="font-medium">UF</label>
            <input
              type="text"
              readOnly
              value={uf}
              className="border p-3 rounded-lg w-full mt-1 bg-gray-100"
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="font-medium">Cidade</label>
            <input
              type="text"
              readOnly
              value={cidade || "-"}
              className="border p-3 rounded-lg w-full mt-1 bg-gray-100"
            />
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="font-medium">Descrição da Roteirização *</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Roteirização Março – Fortaleza"
              maxLength={60}
              className="border p-3 rounded-lg w-full mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Máximo 60 caracteres.</p>
          </div>

          {/* Dias úteis */}
          <div>
            <label className="font-medium">Dias Úteis</label>
            <input
              type="number"
              value={diasUteis}
              onChange={(e) => setDiasUteis(parseInt(e.target.value))}
              className="border p-3 rounded-lg w-full mt-1"
            />
          </div>

          {/* Frequência */}
          <div>
            <label className="font-medium">Frequência de Entrega</label>
            <input
              type="number"
              value={freq}
              onChange={(e) => setFreq(parseInt(e.target.value))}
              className="border p-3 rounded-lg w-full mt-1"
            />
          </div>

          {/* Tempo parada */}
          <div>
            <label className="font-medium">Tempo Parada (min)</label>
            <input
              type="number"
              value={serviceMin}
              onChange={(e) => setServiceMin(parseFloat(e.target.value))}
              className="border p-3 rounded-lg w-full mt-1"
            />
          </div>

          {/* Velocidade */}
          <div>
            <label className="font-medium">Velocidade Média (km/h)</label>
            <input
              type="number"
              value={velMedia}
              onChange={(e) => setVelMedia(parseFloat(e.target.value))}
              className="border p-3 rounded-lg w-full mt-1"
            />
          </div>

          {/* UI only */}
          <div>
            <label className="font-medium">Distância Máxima (visual)</label>
            <input
              type="number"
              value={maxKm}
              onChange={(e) => setMaxKm(parseFloat(e.target.value))}
              className="border p-3 rounded-lg w-full mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Tempo Máximo (visual)</label>
            <input
              type="number"
              value={maxMin}
              onChange={(e) => setMaxMin(parseFloat(e.target.value))}
              className="border p-3 rounded-lg w-full mt-1"
            />
          </div>
        </div>

        <div className="mt-10">
          <button
            disabled={loading}
            onClick={iniciar}
            className={`px-6 py-3 rounded-lg text-white font-medium shadow ${
              loading ? "bg-gray-400" : "bg-brand hover:bg-brand/80"
            }`}
          >
            {loading ? "Processando..." : "Iniciar Roteirização"}
          </button>
        </div>
      </div>
    </div>
  );
}
