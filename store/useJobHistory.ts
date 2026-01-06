// sales_router_frontend/store/useJobHistory.ts


import { create } from "zustand";
import { getUltimosJobsPDV } from "@/services/pdv";   // <--- ALTERADO AQUI

interface JobHistoryState {
  jobs: any[];
  loading: boolean;
  carregar: () => Promise<void>;
  atualizar: () => Promise<void>;
}

export const useJobHistory = create<JobHistoryState>((set) => ({
  jobs: [],
  loading: false,

  carregar: async () => {
    set({ loading: true });
    try {
      const res = await getUltimosJobsPDV();      // <--- ALTERADO AQUI
      set({ jobs: res.jobs || [] });
    } finally {
      set({ loading: false });
    }
  },

  atualizar: async () => {
    set({ loading: true });
    try {
      const res = await getUltimosJobsPDV();      // <--- ALTERADO AQUI
      set({ jobs: res.jobs || [] });
    } finally {
      set({ loading: false });
    }
  },
}));

