//sales_router_frontend/app/(dashboard)/dados/uploads/page.tsx

"use client";

import { useState, useEffect } from "react";
import { uploadPDV, filtrarJobsPDV } from "@/services/pdv";

import { FileSpreadsheet, UploadCloud } from "lucide-react";

import { useJobProgress } from "@/store/useJobProgress";
import { useJobHistory } from "@/store/useJobHistory";

export default function UploadDadosPage() {
  const [file, setFile] = useState<File | null>(null);
  const [descricao, setDescricao] = useState("");

  const [filteredJobs, setFilteredJobs] = useState<any[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // filtros
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const { progress, status, setJob } = useJobProgress();
  const { jobs, carregar } = useJobHistory();

  useEffect(() => {
    carregar();
  }, []);

  async function aplicarFiltro() {
    const r = await filtrarJobsPDV({
      data_inicio: dataInicio || undefined,
      data_fim: dataFim || undefined,
      descricao: filtroDescricao || undefined,
    });
    setFilteredJobs(r.jobs || []);
  }

  async function handleUpload() {
    if (!file) return alert("Selecione um arquivo CSV.");
    if (!descricao) return alert("Digite uma descrição.");

    try {
      const res = await uploadPDV(file, descricao);
      if (res.job_id) setJob(res.job_id, descricao);

      setFile(null);
      setDescricao("");

      carregar();
      setFilteredJobs(null);
    } catch {
      alert("Erro ao enviar arquivo.");
    }
  }

  /** DROPZONE **/
  const Dropzone = () => (
    <div
      className={`
        border-2 border-dashed rounded-xl p-10 text-center transition
        ${isDragging ? "border-brand-soft bg-brand-soft/40" : "border-neutral-border bg-white"}
        hover:border-brand-primary hover:bg-brand-soft/20 cursor-pointer
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) setFile(f);
      }}
      onClick={() => document.getElementById("dadosUploadFile")?.click()}
    >
      <UploadCloud className="mx-auto mb-4 h-12 w-12 text-brand-primary" />

      {!file ? (
        <>
          <p className="font-semibold text-neutral-text">Arraste o arquivo CSV</p>
          <p className="text-neutral-subtitle text-sm">Ou clique para selecionar</p>
        </>
      ) : (
        <p className="font-semibold">{file.name}</p>
      )}

      <input
        id="dadosUploadFile"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
    </div>
  );

  const lista = filteredJobs ?? jobs;

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-12">

      {/* =====================================================
          TÍTULO
      ===================================================== */}
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="text-brand-primary h-9 w-9" />
        <h1 className="text-3xl font-bold text-neutral-text">
          Dados → Uploads
        </h1>
      </div>

      {/* =====================================================
          UPLOAD BOX
      ===================================================== */}
      <div className="bg-white border border-neutral-border rounded-2xl shadow-card p-10 space-y-8">
        <h2 className="text-xl font-semibold text-neutral-text">
          Enviar Arquivo CSV
        </h2>

        <Dropzone />

        <input
          type="text"
          placeholder="Descrição do upload"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="border border-neutral-border p-3 rounded-lg w-full bg-neutral-bg"
        />

        <button
          onClick={handleUpload}
          className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg shadow transition flex items-center gap-2"
        >
          <UploadCloud className="h-5 w-5" />
          Enviar arquivo
        </button>

        {status === "running" && (
          <div className="mt-4 space-y-1">
            <p className="text-neutral-text">Processando ({progress}%)</p>
            <div className="w-full bg-neutral-border rounded-full h-3">
              <div
                className="bg-brand-primary h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          FILTROS
      ===================================================== */}
      <div className="bg-white border border-neutral-border rounded-2xl shadow-card p-10 space-y-6">
        <h2 className="text-xl font-semibold text-neutral-text">
          Filtrar Processamentos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border border-neutral-border p-3 rounded-lg bg-neutral-bg"
          />

          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border border-neutral-border p-3 rounded-lg bg-neutral-bg"
          />

          <input
            type="text"
            placeholder="Descrição contém..."
            value={filtroDescricao}
            onChange={(e) => setFiltroDescricao(e.target.value)}
            className="border border-neutral-border p-3 rounded-lg bg-neutral-bg"
          />

          <button
            onClick={aplicarFiltro}
            className="bg-brand-primary text-white p-3 rounded-lg shadow hover:bg-brand-secondary"
          >
            Filtrar
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              setFilteredJobs(null);
              setDataInicio("");
              setDataFim("");
              setFiltroDescricao("");
            }}
            className="bg-neutral-border text-neutral-text px-5 py-3 rounded-lg hover:bg-neutral-200"
          >
            Limpar filtro
          </button>
        </div>
      </div>

      {/* =====================================================
          TABELA HISTÓRICO
      ===================================================== */}
      <div className="bg-white border border-neutral-border rounded-2xl shadow-card p-10">
        <h2 className="text-xl font-semibold text-neutral-text mb-6">
          Últimos Processamentos
        </h2>

        <div className="overflow-x-auto rounded-xl border border-neutral-border">
          <table className="w-full text-sm">
            <thead className="bg-neutral-bg text-neutral-text border-b border-neutral-border">
              <tr>
                <th className="py-3 px-3 text-left">Descrição</th>
                <th className="py-3 px-3 text-left">Input ID</th>
                <th className="py-3 px-3 text-left">Status</th>
                <th className="py-3 px-3 text-center">Processados</th>
                <th className="py-3 px-3 text-center">Válidos</th>
                <th className="py-3 px-3 text-center">Inválidos</th>
                <th className="py-3 px-3 text-center">Data</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-neutral-subtitle py-6">
                    Nenhum processamento encontrado.
                  </td>
                </tr>
              )}

              {lista.map((job, idx) => (
                <tr
                  key={job.job_id}
                  className={`
                    border-b border-neutral-border
                    ${idx % 2 === 0 ? "bg-white" : "bg-neutral-bg"}
                    hover:bg-brand-soft/40 transition
                  `}
                >
                  <td className="py-3 px-3 font-medium">{job.descricao}</td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{job.input_id}</span>
                      <button
                        onClick={() => navigator.clipboard?.writeText(job.input_id)}
                        className="p-1 hover:bg-neutral-border rounded"
                        title="Copiar Input ID"
                      >
                        📋
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-3">{job.status}</td>

                  <td className="py-3 px-3 text-center">{job.total_processados}</td>
                  <td className="py-3 px-3 text-center">{job.validos}</td>
                  <td className="py-3 px-3 text-center">{job.invalidos}</td>

                  <td className="py-3 px-3 text-center">
                    {new Date(job.criado_em).toLocaleString("pt-BR")}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      className="text-brand-primary hover:text-brand-secondary px-3 py-1 border border-brand-primary rounded-md"
                      onClick={() => (window.location.href = `/dados/uploads/${job.job_id}`)}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
