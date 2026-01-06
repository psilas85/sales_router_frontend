// store/useProcessamentoStore.ts
import { create } from "zustand";

interface ProcessamentoState {
  step: "entrada" | "cluster" | "rotas";
  inputId: string | null;
  clusterizationId: string | null;
  routingId: string | null;

  setStep: (s: ProcessamentoState["step"]) => void;
  setInputId: (id: string) => void;
  setClusterizationId: (id: string) => void;
  setRoutingId: (id: string) => void;
}

export const useProcessamentoStore = create<ProcessamentoState>((set) => ({
  step: "entrada",
  inputId: null,
  clusterizationId: null,
  routingId: null,

  setStep: (step) => set({ step }),
  setInputId: (inputId) => set({ inputId }),
  setClusterizationId: (clusterizationId) => set({ clusterizationId }),
  setRoutingId: (routingId) => set({ routingId }),
}));
