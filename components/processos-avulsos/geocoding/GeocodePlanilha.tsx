//sales_router_frontend/components/processos-avulsos/geocoding/GeocodePlanilha.tsx

"use client"

import {useState} from "react"
import {uploadGeocode,jobStatus,downloadGeocode} from "@/services/geocoding"

export default function GeocodePlanilha(){

  const [file,setFile] = useState<File>()
  const [job,setJob] = useState<any>(null)

  async function enviar(){

    if(!file) return

    const res = await uploadGeocode(file)

    setJob({
      job_id:res.job_id,
      status:"queued"
    })

    acompanhar(res.job_id)
  }

  async function acompanhar(job_id:string){

    const interval = setInterval(async ()=>{

      const status = await jobStatus(job_id)

      setJob(status)

      if(status.status==="finished"){

        clearInterval(interval)

      }

    },2000)

  }

  return(

    <div className="space-y-4">

      <input
        type="file"
        onChange={(e)=>setFile(e.target.files?.[0])}
      />

      <button
        onClick={enviar}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Enviar planilha
      </button>

      {job && (

        <div className="border p-4">

          <div>Status: {job.status}</div>
          <div>Progresso: {job.progress}%</div>
          <div>Etapa: {job.step}</div>

          {job.status==="finished" && (

            <button
              onClick={()=>downloadGeocode(job.job_id)}
              className="mt-4 bg-green-600 text-white px-4 py-2"
            >
              Baixar resultado
            </button>

          )}

        </div>

      )}

    </div>

  )

}