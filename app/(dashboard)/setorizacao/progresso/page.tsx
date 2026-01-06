// sales_router_frontend/app/(dashboard)/setorizacao/progresso/page.tsx

"use client";

import { useEffect } from "react";
import { useClusterProgressStore } from "../../../../store/useClusterProgressStore";

export default function ProgressoClusterPage() {
  const { jobId, progress, status, message, fetchProgress } =
    useClusterProgressStore();

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(() => {
      fetchProgress();
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Progresso da Clusterização</h1>

      {!jobId && <p>Nenhuma clusterização em andamento.</p>}

      {jobId && (
        <>
          <p className="text-lg mb-4">Job ID: {jobId}</p>

          <div className="w-full bg-gray-200 h-6 rounded-lg overflow-hidden mb-4">
            <div
              className="bg-brand h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-lg">Status: {status}</p>
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </>
      )}
    </div>
  );
}
