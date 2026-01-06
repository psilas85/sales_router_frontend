import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PipelineState {
  token: string | null;
  tenant_id: number | null;
  input_id: string | null;
  clusterization_id: string | null;
  routing_id: string | null;

  setToken: (t: string) => void;
  setTenantId: (t: number) => void;
  setInputId: (id: string) => void;
  setClusterizationId: (id: string) => void;
  setRoutingId: (id: string) => void;

  clear: () => void;
}

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set) => ({
      token: null,
      tenant_id: null,
      input_id: null,
      clusterization_id: null,
      routing_id: null,

      setToken: (token) => set({ token }),
      setTenantId: (tenant_id) => set({ tenant_id }),
      setInputId: (input_id) => set({ input_id }),
      setClusterizationId: (clusterization_id) => set({ clusterization_id }),
      setRoutingId: (routing_id) => set({ routing_id }),

      clear: () =>
        set({
          token: null,
          tenant_id: null,
          input_id: null,
          clusterization_id: null,
          routing_id: null,
        }),
    }),
    { name: "sales_router_pipeline" }
  )
);
