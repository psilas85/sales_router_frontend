//sales_router_frontend/components/processos-avulsos/geocoding/GeocodePlanilha.tsx

"use client"

import { useState, useRef } from "react"
import { uploadGeocode, jobStatus, downloadGeocode } from "@/services/geocoding"
import api from "@/services/api"
import dynamic from "next/dynamic"

const GeocodeResultMap = dynamic(
  () => import("@/components/maps/GeocodeResultMap"),
  { ssr: false }
)

type Resumo = {
  total?: number
  sucesso?: number
  falhas?: number
}

export default function GeocodePlanilha() {

  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [resumo, setResumo] = useState<Resumo | null>(null)

  const [pontosMapa, setPontosMapa] = useState<any[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [intervalId, setIntervalId] = useState<any>(null)

  function resetar() {
    setFile(null)
    setJob(null)
    setResumo(null)
    setPontosMapa([])
    setMapLoaded(false)
    setLoading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (intervalId) {
      clearInterval(intervalId)
    }
  }

  function sampleRandom(array: any[], n: number) {

    if (array.length <= n) return array

    const result: any[] = []

    for (let i = 0; i < n; i++) {

      const index = Math.floor(Math.random() * array.length)

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

    let ativo = true

    if (intervalId) {
      clearInterval(intervalId)
    }

    const interval = setInterval(async () => {

      if (!ativo) return

      const status = await jobStatus(job_id)

      if (status.status === "finished") {

        setJob({
          ...status,
          progress: 100,
          step: "Concluído"
        })

        if (status.result) {
          setResumo({
            total: status.result.total,
            sucesso: status.result.sucesso,
            falhas: status.result.falhas
          })
        }

        setLoading(false)
        ativo = false
        clearInterval(interval)
        return
      }

      setJob(status)

    }, 2000)

    setIntervalId(interval)
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

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h3 className="text-lg font-semibold">
          Geocodificação em Lote
        </h3>

        <p className="text-sm text-gray-500">
          Envie uma planilha para geocodificar múltiplos endereços.
        </p>

      </div>

      {/* UPLOAD */}

      <div className="flex gap-3 items-center flex-wrap">

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={enviar}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Enviar planilha
        </button>

        {job && (
          <button
            onClick={resetar}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            Novo upload
          </button>
        )}

      </div>

      {/* STATUS */}

      {job && (

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4 max-w-3xl">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium text-gray-700">
              Status: {job.status}
            </span>

            <span className="text-xs text-gray-500">
              {job.step ?? "-"}
            </span>

          </div>

          {/* PROGRESS BAR */}

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${job.progress ?? 0}%` }}
            />

          </div>

          <div className="text-xs text-gray-500">
            {job.progress ?? 0}% concluído
          </div>

          {/* RESUMO */}

          {resumo && (

            <div className="grid grid-cols-3 gap-3 pt-2">

              <ResumoBox
                label="Total"
                value={resumo.total ?? 0}
              />

              <ResumoBox
                label="Geocodificados"
                value={resumo.sucesso ?? 0}
                green
              />

              <ResumoBox
                label="Inválidos"
                value={resumo.falhas ?? 0}
                red
              />

            </div>

          )}

          {/* AÇÕES */}

          {job.status === "finished" && (

            <div className="flex gap-3 pt-2">

              <button
                onClick={() => downloadGeocode(job.job_id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
              >
                Baixar resultado
              </button>

              {!mapLoaded && (

                <button
                  onClick={gerarMapa}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm"
                >
                  Gerar mapa
                </button>

              )}

            </div>

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

function ResumoBox({
  label,
  value,
  green,
  red
}: {
  label: string
  value: number
  green?: boolean
  red?: boolean
}) {

  const color =
    green
      ? "border-green-200 bg-green-50 text-green-700"
      : red
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-gray-200"

  return (

    <div className={`rounded-lg border px-4 py-3 text-center ${color}`}>

      <p className="text-xs">
        {label}
      </p>

      <p className="text-lg font-semibold">
        {value}
      </p>

    </div>

  )

}