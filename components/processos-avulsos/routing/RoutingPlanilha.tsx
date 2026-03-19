//sales_router_frontend/components/processos-avulsos/routing/RoutingPlanilha.tsx

"use client"

import { useState, useRef, useEffect } from "react"
import {
  uploadRouting,
  routingJobStatus,
  downloadRouting
} from "@/services/routing_engine"

import dynamic from "next/dynamic"
import api from "@/services/api"

const MapaBase = dynamic(
  () => import("@/components/MapaBase"),
  { ssr: false }
)

export default function RoutingPlanilha() {

  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [geojson, setGeojson] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [intervalId, setIntervalId] = useState<any>(null)

  // evita memory leak
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  function resetar() {

    setFile(null)
    setJob(null)
    setGeojson(null)
    setMapLoaded(false)
    setLoading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    if (intervalId) {
      clearInterval(intervalId)
    }
  }

  async function enviar() {

    if (!file || loading) return

    setLoading(true)

    try {

      const res = await uploadRouting(file)

      setJob({
        job_id: res.job_id,
        status: "queued",
        progress: 0,
        step: "Enfileirado"
      })

      acompanhar(res.job_id)

    } catch (err) {
      console.error("Erro no upload:", err)
      setLoading(false)
    }
  }

  async function acompanhar(job_id: string) {

    if (intervalId) clearInterval(intervalId)

    const interval = setInterval(async () => {

      try {

        const status = await routingJobStatus(job_id)

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

      } catch (err) {
        console.error("Erro no status:", err)
      }

    }, 2000)

    setIntervalId(interval)
  }

  async function gerarMapa() {

    if (!job?.job_id) return

    try {

      const res = await api.get(
        `/routing-engine/api/v1/job/${job.job_id}/map`
      )

      const geojson = res.data

      if (!geojson || !geojson.features) {
        console.error("GeoJSON inválido", geojson)
        return
      }

      setGeojson(geojson)
      setMapLoaded(true)

    } catch (err) {
      console.error("Erro ao carregar mapa", err)
    }
  }

  return (

    <div className="space-y-8">

      <div>
        <h3 className="text-lg font-semibold">Roteirização</h3>
        <p className="text-sm text-gray-500">
          Envie uma planilha para gerar rotas automaticamente.
        </p>
      </div>

      {/* UPLOAD */}
      <div className="flex gap-3 items-center flex-wrap">

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={enviar}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Processando..." : "Enviar planilha"}
        </button>

        {job && (
          <button
            onClick={resetar}
            className="px-4 py-2 border rounded"
          >
            Novo upload
          </button>
        )}

      </div>

      {/* STATUS */}
      {job && (

        <div className="bg-white border rounded-xl p-4 space-y-4 max-w-3xl">

          <div className="flex justify-between">
            <span>Status: {job.status}</span>
            <span>{job.step}</span>
          </div>

          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-blue-600 h-3 rounded"
              style={{ width: `${job.progress ?? 0}%` }}
            />
          </div>

          {job.status === "finished" && (

            <div className="flex gap-3">

              <button
                onClick={() => downloadRouting(job.job_id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Baixar resultado
              </button>

              {!mapLoaded && (
                <button
                  onClick={gerarMapa}
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Gerar mapa
                </button>
              )}

            </div>

          )}

        </div>

      )}

      {/* MAPA */}
      {mapLoaded && geojson && (

        <div className="mt-8">
          <h4 className="font-semibold">Mapa de rotas</h4>
          <MapaBase geojson={geojson} />
        </div>

      )}

    </div>

  )
}