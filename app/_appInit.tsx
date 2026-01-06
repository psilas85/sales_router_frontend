// sales_router_frontend/app/_appInit.tsx

"use client";

import { useEffect } from "react";
import { useJobProgress } from "@/store/useJobProgress";
import { useAuthStore } from "@/store/useAuthStore";

export function InitJobProgress() {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    // 🔐 Inicializa AUTH (ESSENCIAL)
    loadUser();

    // ⚙️ Mantém Job Progress funcionando
    const state = useJobProgress.getState();
    if (state.currentJobId && state.status === "running") {
      state.pollJob();
    }
  }, []);

  return null;
}
