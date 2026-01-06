// sales_router_frontend/components/processamento/entrada-de-dados/EntradaTab.tsx

"use client";

import { useState, useEffect } from "react";
import {
  uploadPDV,
  detalharJob,
  downloadInvalidos,
} from "@/services/pdv";
import { useProcessamentoStore } from "@/store/useProcessamentoStore";
import { useJobProgress } from "@/store/useJobProgress";
import JobProgressBar from "@/components/JobProgressBar";

interface ResumoProcessamento {
  descricao: string;
  arquivo: string;
  jobId: string;
  inputId: string;
  total: number;
  validos: number;
  invalidos: number;
}

export default function EntradaTab() {
  const { setInputId } = useProcessamentoStore();
  const { currentJobId, setJob, clear } = useJobProgress();

  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resumo, setResumo] = useState<ResumoProcessamento | null>(null);

  // ============================================================
  // RESET AO ENTRAR NA ABA
  // ============================================================
  useEffect(() => {
    resetarUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // POLLING DO JOB
  // ============================================================
  useEffect(() => {
    if (!currentJobId || resumo) return;

    async function carregarResumo() {
      try {
        const job = await detalharJob(currentJobId);
        if (!job?.input_id) return;

        setResumo({
          descricao: job.descricao || descricao,
          arquivo: job.arquivo || file?.name || "",
          jobId: currentJobId,
          inputId: job.input_id,
          total: job.total_processados ?? 0,
          validos: job.validos ?? 0,
          invalidos: job.invalidos ?? 0,
        });

        setInputId(job.input_id);
      } catch {
        // silêncio
      }
    }

    carregarResumo();
    const i = setInterval(carregarResumo, 2000);
    return () => clearInterval(i);
  }, [currentJobId, resumo, descricao, file, setInputId]);

  // ============================================================
  // UPLOAD
  // ============================================================
  async function handleUpload() {
    try {
      setError(null);
      setResumo(null);

      if (!descricao.trim()) {
        setError("Informe uma descrição.");
        return;
      }

      if (!file) {
        setError("Selecione um arquivo XLSX.");
        return;
      }

      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        setError("Formato inválido. Utilize o template XLSX.");
        return;
      }

      const resp = await uploadPDV(file, descricao);

      if (!resp?.job_id) {
        setError("Erro ao iniciar processamento.");
        return;
      }

      setJob(resp.job_id, descricao);
    } catch {
      setError("Falha no upload.");
    }
  }

  // ============================================================
  // RESET
  // ============================================================
  function resetarUpload() {
    clear();
    setResumo(null);
    setFile(null);
    setDescricao("");
    setError(null);
    setFileKey((k) => k + 1);
  }

  return (
    <div className="space-y-4">
      {/* CARD UPLOAD */}
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-100 max-w-3xl ${
          resumo ? "p-3 space-y-2" : "p-4 space-y-3"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            Upload de arquivo
          </h2>

          {/* DOWNLOAD TEMPLATE */}
          <a
            href="/templates/PDV_Template.xlsx"
            target="_blank"
            className="text-xs text-brand hover:underline"
          >
            Baixar template XLSX
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">
              Descrição
            </label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Carteira_Nome_Data"
              className="mt-1 w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">
              Arquivo (XLSX)
            </label>
            <input
              key={fileKey}
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 block text-sm"
            />
          </div>
        </div>

        {file && (
          <p className="text-xs text-gray-600">
            Arquivo selecionado: <strong>{file.name}</strong>
          </p>
        )}

        {!currentJobId && (
          <div className="pt-2">
            <button
              onClick={handleUpload}
              className="px-5 py-2 bg-brand text-white rounded-md text-sm"
            >
              Enviar arquivo
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      {/* PROGRESSO */}
      {currentJobId && !resumo && <JobProgressBar />}

      {/* RESUMO */}
      {resumo && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 max-w-3xl space-y-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            ✔ Processamento concluído
          </span>

          <div className="space-y-1 text-sm">
            <p><strong>Descrição:</strong> {resumo.descricao}</p>
            <p><strong>Arquivo:</strong> {resumo.arquivo}</p>
            <p className="font-mono text-[11px] text-gray-500 break-all">
              {resumo.inputId}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <ResumoBox label="Total" value={resumo.total} />
            <ResumoBox label="Válidos" value={resumo.validos} green />
            <ResumoBox label="Inválidos" value={resumo.invalidos} red />
          </div>

          <div className="flex gap-3 flex-wrap pt-1">
            <button
              onClick={resetarUpload}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
            >
              Novo upload
            </button>

            {resumo.invalidos > 0 && (
              <button
                onClick={() => downloadInvalidos(resumo.jobId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                Baixar inválidos (CSV)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE AUXILIAR
// ============================================================
function ResumoBox({
  label,
  value,
  green,
  red,
}: {
  label: string;
  value: number;
  green?: boolean;
  red?: boolean;
}) {
  const color =
    green
      ? "border-green-200 bg-green-50 text-green-700"
      : red
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-gray-200";

  return (
    <div className={`rounded-lg border px-4 py-3 text-center ${color}`}>
      <p className="text-xs">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
