//sales_router_frontend/services/geocoding.ts

import api from "./api"

export async function geocodeEndereco(data:any){

  const res = await api.post(
    "/geocode/api/v1/geocode",
    data
  )

  return res.data
}

export async function uploadGeocode(file:File){

  const form = new FormData()

  form.append("file", file)

  const res = await api.post(
    "/geocode/api/v1/upload",
    form,
    {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }
  )

  return res.data
}

export async function jobStatus(job_id:string){

  const res = await api.get(
    `/geocode/api/v1/job/${job_id}`
  )

  return res.data
}

export async function downloadGeocode(job_id:string){

  const res = await api.get(
    `/geocode/api/v1/job/${job_id}/download`,
    {
      responseType:"blob"
    }
  )

  const url = window.URL.createObjectURL(new Blob([res.data]))

  const link = document.createElement("a")

  link.href = url

  link.setAttribute("download","geocode_result.xlsx")

  document.body.appendChild(link)

  link.click()

  link.remove()

}