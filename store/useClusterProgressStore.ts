// sales_router_frontend/store/useClusterProgressStore.ts

import { create } from "zustand";
import { progressoClusterJob } from "../services/cluster_progress";

interface ClusterProgressState {
  jobId: string | null;
  progress: number;
  status: string | null;
  message: string | null;

  setJob: (jobId: string) => void;
  fetchProgress: () => Promise<void>;
  reset: () => void;
}

export const useClusterProgressStore = create<ClusterProgressState>((set, get) => ({
  jobId: null,
  progress: 0,
  status: null,
  message: null,

  setJob: (jobId: string) => set({ jobId }),

  fetchProgress: async () => {
    const jobId = get().jobId;
    if (!jobId) return;

    try {
      const res = await progressoClusterJob(jobId);

      // Backend retorna META com os dados reais do progresso
      const meta = res.meta || {};

      set({
        progress: meta.progress ?? 0,
        status: meta.status ?? res.status ?? null,
        message: meta.mensagem ?? null,
      });

    } catch (err) {
      console.error("Erro progresso:", err);
    }
  },

  reset: () =>
    set({
      jobId: null,
      progress: 0,
      status: null,
      message: null,
    }),
}));

