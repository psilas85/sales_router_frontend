//sales_router_frontend/components/processamento/roteirizacao/ProgressoRoteirizacao.tsx

"use client";

import { useState } from "react";
import { iniciarRoteirizacao } from "@/services/routing";
import { useRoutingProgressStore } from "@/store/useRoutingProgressStore";

interface Props {
  clusterizationId: string;
  uf: string;
  cidade: string | null;
  onClose: () => void;
}

export default function ParametrosRoteirizacao({
  clusterizationId,
  uf,
  cidade,
  onClose,
}: Props) {
  const [descricao, setDescricao] = useState("");
  const [diasUteis, setDiasUteis] = useState(21);
  const [frequencia, setFrequencia] = useState(1);
  const [serviceMin, setServiceMin] = useState(30);

  const [minPdvs, setMinPdvs] = useState(8);
  const [maxPdvs, setMaxPdvs] = useState(12);

  const { setJob, reset } = useRoutingProgressStore();

  const rotasEstimadas =
    frequencia > 0 ? Math.floor(diasUteis / frequencia) : 0;

  async function executar() {

    if (!descricao.trim()){
      alert("Descrição é obrigatória");
      return;
    }

    if (minPdvs > maxPdvs) {
      alert("PDVs mínimos não pode ser maior que PDVs máximos.");
      return;
    }

    if (diasUteis <= 0) {
      alert("Dias úteis deve ser maior que zero.");
      return;
    }

    if (frequencia <= 0) {
      alert("Frequência deve ser maior que zero.");
      return;
    }

    if (frequencia > diasUteis) {
      alert("Frequência não pode ser maior que dias úteis");
      return;
    }

    reset();

    const payload = {
      clusterization_id: clusterizationId,
      descricao,
      uf,
      cidade,
      dias_uteis: diasUteis,
      frequencia_visita: frequencia,
      min_pdvs_rota: minPdvs,
      max_pdvs_rota: maxPdvs,
      service_min: serviceMin,
    };

    try {

      const r = await iniciarRoteirizacao(payload);

      setJob(r.job_id);

      onClose();

      window.dispatchEvent(new Event("abrir-progresso-routing"));
      window.dispatchEvent(new Event("expandir-historico-routing"));

    } catch (err: any) {

      alert(err?.response?.data?.detail || "Erro ao iniciar roteirização");

    }

  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block mb-1 font-medium">Clusterization ID</label>
        <input
          value={clusterizationId}
          disabled
          className="w-full border p-3 rounded bg-gray-100"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">UF</label>
          <input
            value={uf}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cidade</label>
          <input
            value={cidade || ""}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Descrição *</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border p-3 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Dias úteis</label>
          <input
            type="number"
            value={diasUteis}
            onChange={(e) => setDiasUteis(Number(e.target.value))}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Frequência de visita</label>
          <input
            type="number"
            value={frequencia}
            onChange={(e) => setFrequencia(Number(e.target.value))}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Tempo de serviço (min)</label>
          <input
            type="number"
            value={serviceMin}
            onChange={(e) => setServiceMin(Number(e.target.value))}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">PDVs mínimos por rota</label>
          <input
            type="number"
            value={minPdvs}
            onChange={(e) => setMinPdvs(Number(e.target.value))}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">PDVs máximos por rota</label>
          <input
            type="number"
            value={maxPdvs}
            onChange={(e) => setMaxPdvs(Number(e.target.value))}
            className="w-full border p-3 rounded"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Rotas estimadas no ciclo: <b>{rotasEstimadas}</b>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
          Cancelar
        </button>

        <button
          onClick={executar}
          className="px-6 py-2 bg-brand text-white rounded"
        >
          Executar
        </button>
      </div>
    </div>
  );
}
