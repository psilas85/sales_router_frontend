// sales_router_frontend/store/useLayoutStore.ts

import { create } from "zustand";

interface LayoutState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
