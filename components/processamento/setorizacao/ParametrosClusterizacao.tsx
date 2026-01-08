//sales_router_frontend/components/processamento/setorizacao/ParametrosClusterizacao.tsx

"use client";

import { useEffect, useState } from "react";
import { criarClusterizacao } from "@/services/cluster";
import { PARAMS_BY_ALGO } from "@/services/cluster_params";
import { useClusterProgressStore } from "@/store/useClusterProgressStore";

interface Props {
  inputId: string;
  onClose: () => void;
}

/**
 * Textos explicativos dos algoritmos (UX)
 */
const ALGO_HELP: Record<string, string> = {
  kmeans: "Simula divisão automática da carteira.",
  capacitated_sweep: "Divide toda a base respeitando capacidade por rota/cluster.",
  dense_subset: "Seleciona apenas os PDVs mais concentrados (capacidade total).",
};

export default function ParametrosClusterizacao({ inputId, onClose }: Props) {
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [algo, setAlgo] = useState("kmeans");
  const [formVals, setFormVals] = useState<any>({});

  const { setJob, reset } = useClusterProgressStore();

  useEffect(() => {
    const defaults: any = {};
    PARAMS_BY_ALGO[algo].fields.forEach((f: any) => {
      defaults[f.key] = f.default;
    });
    setFormVals(defaults);
  }, [algo]);

  function updateField(key: string, value: any) {
    setFormVals((p: any) => ({ ...p, [key]: value }));
  }

  async function enviar() {
  if (!uf || !descricao) {
    alert("UF e descrição são obrigatórias");
    return;
  }

  if (algo === "capacitated_sweep" && !cidade.trim()) {
    alert("Cidade é obrigatória para a estratégia DIVISOR");
    return;
  }

  reset();

  const payload: any = {
    input_id: inputId,
    uf,
    cidade: cidade || null,
    descricao,
    algo,
    ...formVals,
  };

  const r = await criarClusterizacao(payload);

  setJob(r.job_id);
  onClose();

  window.dispatchEvent(new Event("abrir-progresso-cluster"));
  window.dispatchEvent(new Event("expandir-historico-cluster"));
}

  const podeExecutar =
  uf &&
  descricao &&
  (algo !== "capacitated_sweep" || cidade.trim());


  return (
    <div className="space-y-5">
      {/* INPUT ID */}
      <div>
        <label className="block mb-1 font-medium">Input ID</label>
        <input
          value={inputId}
          disabled
          className="w-full border p-3 rounded bg-gray-100"
        />
      </div>

      {/* UF */}
      <div>
        <label className="block mb-1 font-medium">UF *</label>
        <input
          value={uf}
          onChange={(e) => setUf(e.target.value.toUpperCase())}
          className="w-full border p-3 rounded"
        />
      </div>

      {/* CIDADE */}
      <div>
        <label className="block mb-1 font-medium">
          Cidade {algo === "capacitated_sweep" && "*"}
        </label>
        <input
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="w-full border p-3 rounded"
        />
      </div>


      {/* DESCRIÇÃO */}
      <div>
        <label className="block mb-1 font-medium">Descrição *</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border p-3 rounded"
        />
      </div>

      {/* ALGORITMO */}
      <div>
        <label className="block mb-1 font-medium">Algoritmo</label>
        <select
          value={algo}
          onChange={(e) => setAlgo(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="kmeans">SIMULATOR</option>
          <option value="capacitated_sweep">DIVISOR</option>
          <option value="dense_subset">SELECTOR</option>
        </select>

        {/* EXPLICAÇÃO */}
        <div className="mt-2 text-sm text-gray-600 bg-gray-50 border rounded p-3">
          {ALGO_HELP[algo]}
        </div>

        {/* AVISO EXTRA PARA SELECTOR */}
        {algo === "dense_subset" && (
          <div className="mt-2 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded p-3">
            ⚠️ Este modo não utiliza toda a base. Apenas os PDVs mais concentrados
            entram no resultado final.
          </div>
        )}
      </div>

      {/* PARÂMETROS DINÂMICOS */}
      {PARAMS_BY_ALGO[algo].fields.map((f: any) => (
        <div key={f.key}>
          <label className="block mb-1">{f.label}</label>
          <input
            type={f.type}
            value={formVals[f.key] ?? ""}
            onChange={(e) =>
              updateField(
                f.key,
                f.type === "number"
                  ? Number(e.target.value)
                  : e.target.value
              )
            }
            className="w-full border p-3 rounded"
          />
        </div>
      ))}

      {/* AÇÕES */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancelar
        </button>

        <button
          onClick={enviar}
          disabled={!podeExecutar}
          className={`px-6 py-2 rounded text-white
            ${podeExecutar ? "bg-brand" : "bg-gray-400 cursor-not-allowed"}
          `}
        >
          Executar
        </button>


      </div>
    </div>
  );
}
