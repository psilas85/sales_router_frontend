// sales_router_frontend/store/useRoutingProgressStore.ts

import { create } from "zustand";
import api from "@/services/api";

interface RoutingProgressState {
  jobId: string | null;
  progress: number;
  status: string;
  message: string | null;

  setJob: (id: string) => void;
  reset: () => void;
  fetchProgress: () => Promise<void>;
}

export const useRoutingProgressStore = create<RoutingProgressState>((set, get) => ({
  jobId: null,
  progress: 0,
  status: "waiting",
  message: null,

  setJob: (id: string) =>
    set({
      jobId: id,
      progress: 0,
      status: "running",
      message: null,
    }),

  reset: () =>
    set({
      jobId: null,
      progress: 0,
      status: "waiting",
      message: null,
    }),

  fetchProgress: async () => {
    const jobId = get().jobId;
    if (!jobId) return;

    try {
      const res = await api.get(`/routing/status/${jobId}`);

      const progress = res.data.progress ?? 0;
      const status = res.data.status ?? "running";
      const message = res.data.message ?? null;

      set({ progress, status, message });

      if (status === "finished" || status === "failed") {
        set({ jobId: null });
      }
    } catch (e) {
      console.error("Erro ao consultar progresso da roteirização:", e);
    }
  },
}));

