//sales_router_frontend/components/processos-avulsos/geocoding/GeocodePlanilha.tsx

"use client"

import { useState } from "react"
import { uploadGeocode, jobStatus, downloadGeocode } from "@/services/geocoding"
import api from "@/services/api"
import dynamic from "next/dynamic"

const GeocodeResultMap = dynamic(
  () => import("@/components/maps/GeocodeResultMap"),
  { ssr: false }
)

export default function GeocodePlanilha() {

  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [pontosMapa, setPontosMapa] = useState<any[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  function sampleRandom(array: any[], n: number) {

    const result: any[] = []

    const len = array.length

    if (len <= n) return array

    for (let i = 0; i < n; i++) {

      const index = Math.floor(Math.random() * len)

      result.push(array[index])

    }

    return result

  }

  async function enviar() {

    if (!file) return

    setLoading(true)

    const res = await uploadGeocode(file)

    setJob({
      job_id: res.job_id,
      status: "queued",
      progress: 0,
      step: "Enfileirado"
    })

    acompanhar(res.job_id)

  }

  async function acompanhar(job_id: string) {

    const interval = setInterval(async () => {

      const status = await jobStatus(job_id)

      if (status.status === "finished") {

        setJob({
          ...status,
          progress: 100,
          step: "Concluído"
        })

        setLoading(false)

        clearInterval(interval)

        return

      }

      setJob(status)

    }, 2000)

  }

  async function gerarMapa() {

    if (!job?.job_id) return

    try {

      const res = await api.get(`/geocode/api/v1/job/${job.job_id}/result`)

      const sample = sampleRandom(res.data, 1000)

      setPontosMapa(sample)

      setMapLoaded(true)

    } catch (err) {

      console.error("Erro ao carregar pontos para mapa", err)

    }

  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h3 className="text-lg font-semibold">
          Geolocalização em Lote
        </h3>

        <p className="text-sm text-gray-500">
          Envie uma planilha para geocodificar múltiplos endereços.
        </p>

      </div>

      {/* UPLOAD */}

      <div className="flex gap-3 items-center">

        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={enviar}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Enviar planilha
        </button>

      </div>

      {/* STATUS */}

      {job && (

        <div className="border rounded p-4 space-y-3 bg-gray-50">

          <div className="text-sm">
            <b>Status:</b> {job.status}
          </div>

          <div className="text-sm">
            <b>Etapa:</b> {job.step ?? "-"}
          </div>

          {/* PROGRESS BAR */}

          <div className="w-full bg-gray-200 rounded h-3">

            <div
              className="bg-blue-600 h-3 rounded transition-all"
              style={{ width: `${job.progress ?? 0}%` }}
            />

          </div>

          <div className="text-sm">
            <b>Progresso:</b> {job.progress ?? 0}%
          </div>

          {/* DOWNLOAD */}

          {job.status === "finished" && (

            <button
              onClick={() => downloadGeocode(job.job_id)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Baixar resultado
            </button>

          )}

          {/* GERAR MAPA */}

          {job.status === "finished" && !mapLoaded && (

            <button
              onClick={gerarMapa}
              className="mt-2 ml-2 bg-purple-600 text-white px-4 py-2 rounded"
            >
              Gerar mapa
            </button>

          )}

        </div>

      )}

      {/* MAPA */}

      {mapLoaded && pontosMapa.length > 0 && (

        <div className="mt-8 space-y-2">

          <h4 className="font-semibold">
            Visualização geográfica
          </h4>

          <p className="text-xs text-gray-500">
            Exibindo {pontosMapa.length} pontos aleatórios do resultado
          </p>

          <GeocodeResultMap pontos={pontosMapa} />

        </div>

      )}

    </div>

  )

}