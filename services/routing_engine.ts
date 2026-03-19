//sales_router_frontend/services/routing_engine.ts

import api from "./api"

export async function uploadRouting(file: File) {

  const form = new FormData()
  form.append("file", file)

  const res = await api.post(
    "/routing-engine/api/v1/upload",
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )

  return res.data
}

export async function routingJobStatus(job_id: string) {

  const res = await api.get(
    `/routing-engine/api/v1/job/${job_id}`
  )

  return res.data
}

export async function downloadRouting(job_id: string) {

  const res = await api.get(
    `/routing-engine/api/v1/job/${job_id}/download`,
    {
      responseType: "blob"
    }
  )

  const blob = new Blob([res.data])
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `routing_${job_id}.xlsx`)

  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(url)
}