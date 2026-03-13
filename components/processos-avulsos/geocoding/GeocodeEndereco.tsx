//sales_router_frontend/components/processos-avulsos/geocoding/GeocodeEndereco.tsx

"use client"

import {useState} from "react"
import {geocodeEndereco} from "@/services/geocoding"

export default function GeocodeEndereco(){

  const [endereco,setEndereco] = useState("")
  const [cidade,setCidade] = useState("")
  const [uf,setUf] = useState("")
  const [result,setResult] = useState<any>(null)

  async function executar(){

    const res = await geocodeEndereco({
      endereco,
      cidade,
      uf
    })

    setResult(res)
  }

  return(

    <div className="space-y-4">

      <input
        className="border p-2 w-full"
        placeholder="Endereço"
        value={endereco}
        onChange={e=>setEndereco(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Cidade"
        value={cidade}
        onChange={e=>setCidade(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="UF"
        value={uf}
        onChange={e=>setUf(e.target.value)}
      />

      <button
        onClick={executar}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Geocodificar
      </button>

      {result && (

        <div className="border p-4">

          <div>Lat: {result.lat}</div>
          <div>Lon: {result.lon}</div>
          <div>Status: {result.status}</div>

        </div>

      )}

    </div>

  )

}