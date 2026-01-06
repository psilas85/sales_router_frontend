//sales_router_frontend/components/processamento/setorizacao/ProgressoSetorizacao.tsx

"use client";

import { useEffect } from "react";
import { useClusterProgressStore } from "@/store/useClusterProgressStore";

export default function ProgressoSetorizacao() {
  const {
    jobId,
    progress,
    status,
    fetchProgress,
    reset,
  } = useClusterProgressStore();

  // 🔁 polling simples
  useEffect(() => {
    if (!jobId) return;

    fetchProgress(); // busca imediata

    const interval = setInterval(() => {
      fetchProgress();
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  // ✅ fecha drawer automaticamente ao finalizar
  useEffect(() => {
    if (status === "finished") {
      setTimeout(() => {
        window.dispatchEvent(
          new Event("fechar-progresso-cluster")
        );
        reset();
      }, 800);
    }
  }, [status]);

  if (!jobId) return null;

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Job ID: <span className="font-mono">{jobId}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-brand h-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-sm">
        Status: <strong>{status ?? "executando"}</strong>
      </div>
    </div>
  );
}
