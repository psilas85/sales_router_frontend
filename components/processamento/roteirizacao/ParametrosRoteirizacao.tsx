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
  const [diasUteis, setDiasUteis] = useState(20);
  const [frequencia, setFrequencia] = useState(1);
  const [serviceMin, setServiceMin] = useState(30);
  const [velKmh, setVelKmh] = useState(30);

  const { setJob, reset } = useRoutingProgressStore();

  async function executar() {
    if (!descricao) {
      alert("Descrição é obrigatória");
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
      service_min: serviceMin,
      vel_kmh: velKmh,
    };

    const r = await iniciarRoteirizacao(payload);

    setJob(r.job_id);

    onClose();

    window.dispatchEvent(new Event("abrir-progresso-routing"));
    window.dispatchEvent(new Event("expandir-historico-routing"));
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

      <div className="grid grid-cols-2 gap-4">
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
          <label className="block mb-1">Velocidade média (km/h)</label>
          <input
            type="number"
            value={velKmh}
            onChange={(e) => setVelKmh(Number(e.target.value))}
            className="w-full border p-3 rounded"
          />
        </div>
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
