// sales_router_frontend/store/useJobProgress.ts

// sales_router_frontend/store/useJobProgress.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { progressoJob } from "../services/pdv";
import { useJobHistory } from "./useJobHistory";

type JobStatus = "idle" | "running" | "done" | "error";

interface JobProgressState {
  currentJobId: string | null;
  progress: number;
  status: JobStatus;
  description: string | null;

  setJob: (jobId: string, descricao: string) => void;
  pollJob: () => void;
  clear: () => void;
}

export const useJobProgress = create<JobProgressState>()(
  persist(
    (set, get) => ({
      currentJobId: null,
      progress: 0,
      status: "idle",
      description: null,

      // ====================================================
      // SET JOB → inicia barra + polling
      // ====================================================
      setJob: (jobId: string, descricao: string) => {
        set({
          currentJobId: jobId,
          progress: 0,
          status: "running",
          description: descricao,
        });

        get().pollJob();
      },

      // ====================================================
      // POLLING COM NORMALIZAÇÃO DE STATUS
      // ====================================================
      pollJob: async () => {
        const jobId = get().currentJobId;
        if (!jobId) return;

        try {
          const res = await progressoJob(jobId);

          const progressBackend = res.progress ?? 0;
          const rawStatus: string = res.status ?? "running";

          // 🔵 Normaliza qualquer coisa que vier do backend
          let normalizedStatus: JobStatus;

          if (rawStatus === "done" || rawStatus === "finished") {
            normalizedStatus = "done";
          } else if (rawStatus === "error" || rawStatus === "failed") {
            normalizedStatus = "error";
          } else {
            normalizedStatus = "running";
          }

          set({
            progress: progressBackend,
            status: normalizedStatus,
          });

          // 🔚 Se terminou, para polling
          if (normalizedStatus === "done" || normalizedStatus === "error") {
            // 🔵 Atualiza histórico automaticamente (CORRETO)
            const carregar = useJobHistory.getState().carregar;
            carregar();
            return;
          }

          // ⏱ Continua consultando a cada 1s
          setTimeout(() => get().pollJob(), 1000);
        } catch (err) {
          console.error("Erro ao consultar progresso:", err);

          set({
            status: "error",
          });

          return;
        }
      },

      // ====================================================
      // CLEAR
      // ====================================================
      clear: () => {
        set({
          currentJobId: null,
          progress: 0,
          status: "idle",
          description: null,
        });
      },
    }),

    // ======================================================
    // PERSISTÊNCIA (localStorage)
    // ======================================================
    {
      name: "pdv-job-progress",
      partialize: (state) => ({
        currentJobId: state.currentJobId,
        description: state.description,
        status: state.status,
        progress: state.progress,
      }),
    }
  )
);
