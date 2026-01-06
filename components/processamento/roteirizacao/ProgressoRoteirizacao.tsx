//sales_router_frontend/components/processamento/roteirizacao/ProgressoRoteirizacao.tsx

"use client";

import { useEffect } from "react";
import { useRoutingProgressStore } from "@/store/useRoutingProgressStore";

export default function ProgressoRoteirizacao() {
  const {
    jobId,
    progress,
    status,
    fetchProgress,
    reset,
  } = useRoutingProgressStore();

  // polling
  useEffect(() => {
    if (!jobId) return;

    fetchProgress();

    const interval = setInterval(() => {
      fetchProgress();
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  // 🔥 FECHA AUTOMATICAMENTE AO FINALIZAR
  useEffect(() => {
    if (status === "done" || status === "failed") {
      setTimeout(() => {
        window.dispatchEvent(new Event("fechar-progresso-routing"));
        reset();
      }, 600);
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
        Status: <strong>{status}</strong>
      </div>
    </div>
  );
}
