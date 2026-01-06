// sales_router_frontend/app/(dashboard)/roteirizacao/nova/progresso/page.tsx

"use client";

import { useEffect } from "react";
import { useRoutingProgressStore } from "@/store/useRoutingProgressStore";
import Link from "next/link";

export default function ProgressoRoteirizacaoPage() {
  const { jobId, progress, status, message, fetchProgress } =
    useRoutingProgressStore();

  // Polling enquanto houver jobId ativo
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(() => {
      fetchProgress();
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  const finalizado = status === "done" || status === "failed";

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Progresso da Roteirização</h1>

      {/* ====================== */}
      {/* Nenhum job ativo       */}
      {/* ====================== */}
      {!jobId && !finalizado && (
        <p>Nenhuma roteirização em andamento.</p>
      )}

      {/* ====================== */}
      {/* Job em andamento       */}
      {/* ====================== */}
      {(jobId || finalizado) && (
        <>
          {/* Job ID pode desaparecer após fim → só mostrar se existe */}
          {jobId && (
            <p className="text-lg mb-4">Job ID: {jobId}</p>
          )}

          {/* Barra de progresso — se finalizado, fica 100% */}
          <div className="w-full bg-gray-200 h-6 rounded-lg overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-300 ${
                status === "failed" ? "bg-red-500" : "bg-brand"
              }`}
              style={{ width: `${finalizado ? 100 : progress}%` }}
            ></div>
          </div>

          <p className="text-lg">
            Status:{" "}
            <span
              className={
                status === "failed"
                  ? "text-red-600 font-semibold"
                  : status === "done"
                  ? "text-green-600 font-semibold"
                  : ""
              }
            >
              {status}
            </span>
          </p>

          {message && (
            <p className="text-sm text-gray-600 mt-2">
              {message}
            </p>
          )}

          {/* ========================== */}
          {/* Botão apenas quando final  */}
          {/* ========================== */}
          {finalizado && (
            <div className="mt-8">
              <Link
                href="/roteirizacao/historico"
                className="px-6 py-3 bg-brand text-white rounded-lg shadow hover:bg-brand/80"
              >
                Ir para Histórico de Roteirizações
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
