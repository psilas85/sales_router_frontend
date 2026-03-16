//sales_router_frontend/services/geocoding.ts

import api from "./api"

export async function geocodeEndereco(data:any) {

  const res = await api.post("/geocode/api/v1/geocode", data)

  return res.data
}


export async function uploadGeocode(file:File) {

  const form = new FormData()

  form.append("file", file)

  const res = await api.post(
    "/geocode/api/v1/upload",
    form,
    {
      headers:{ "Content-Type":"multipart/form-data" }
    }
  )

  return res.data
}


export async function jobStatus(job_id:string){

  const res = await api.get(`/geocode/api/v1/job/${job_id}`)

  return res.data
}


export function downloadGeocode(job_id:string){

  const url =
    `${process.env.NEXT_PUBLIC_API_URL}/geocode/api/v1/job/${job_id}/download`

  window.open(url, "_blank")

}