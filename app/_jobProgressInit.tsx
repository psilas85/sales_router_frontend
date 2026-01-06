"use client";

import { useEffect } from "react";
import { useJobProgress } from "@/store/useJobProgress";

export function JobProgressInit() {
  useEffect(() => {
    const state = useJobProgress.getState();

    if (state.currentJobId && state.status === "running") {
      state.pollJob();
    }
  }, []);

  return null;
}
