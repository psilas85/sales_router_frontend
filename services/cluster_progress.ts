// services/cluster_progress.ts

import api from "./api";

export async function progressoClusterJob(job_id: string) {
  const res = await api.get(`/cluster/jobs/${job_id}/progress`);
  return res.data;
}
