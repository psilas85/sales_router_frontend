// sales_router_frontend/components/JobProgressBar.tsx

"use client";

import { useEffect } from "react";
import { useJobProgress } from "../store/useJobProgress";
import { motion } from "framer-motion";

export default function JobProgressBar() {
  const { currentJobId, progress, status, description, pollJob } =
    useJobProgress();

  // Se a página recarregar e ainda houver job ativo, retoma polling
  useEffect(() => {
    if (currentJobId && status === "running") {
      pollJob();
    }
  }, [currentJobId, status, pollJob]);

  if (!currentJobId) return null;

  const isDone = status === "done";

  // 🔥 Só "error" — backend nunca envia "failed"
  const isFailed = status === "error";

  const statusLabel =
    isDone ? "Concluído ✓" :
    isFailed ? "Erro no processamento" :
    "Processando...";

  const barColor = isDone
    ? "bg-green-500"
    : isFailed
    ? "bg-red-500"
    : "bg-blue-600";

  return (
    <div className="w-full mt-4 p-4 rounded-xl shadow-md border border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800">
          {description ?? "Processamento em andamento"}
        </span>
        <span className="text-sm font-medium text-gray-500">{statusLabel}</span>
      </div>

      {/* Barra externa */}
      <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">
        {/* Barra interna com animação */}
        <motion.div
          className={`h-4 ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Rodapé da barra */}
      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>ID: {currentJobId}</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}
