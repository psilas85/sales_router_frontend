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
  const intervalRef = useRef<any>(null)

  const [baixando, setBaixando] = useState(false)
  const [gerandoMapa, setGerandoMapa] = useState(false)

  const [params, setParams] = useState({
    dias_uteis: 21,
    freq_visita: 1,
    min_pdvs_rota: 8,
    max_pdvs_rota: 12,
    aplicar_two_opt: false
  })

  // evita memory leak
  useEffect(() => {

    const jobId = localStorage.getItem("routing_job_id")

    if (jobId) {
      acompanhar(jobId)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

  }, [])

  function resetar() {

    localStorage.removeItem("routing_job_id")

    setFile(null)
    setJob(null)
    setGeojson(null)
    setMapLoaded(false)
    setLoading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  async function enviar() {

    if (!file || loading) return

    setLoading(true)

    try {

      const res = await uploadRouting(file, params)

      localStorage.setItem("routing_job_id", res.job_id)

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

    setJob({
      job_id,
      status: "loading",
      progress: 0,
      step: "Recuperando estado..."
    })

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const interval = setInterval(async () => {

      try {

        const status = await routingJobStatus(job_id)

        const isFinished = status.status === "finished"
        const isFailed = status.status === "failed"

        const jobCorrigido = {
          ...status,
          progress: isFinished ? 100 : status.progress ?? 0,
          step: isFinished
            ? "Concluído"
            : isFailed
            ? "Erro na execução"
            : status.step ?? "Processando..."
        }

        setJob(jobCorrigido)

        if (isFinished || isFailed) {

          localStorage.removeItem("routing_job_id")

          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          setLoading(false)
        }

      } catch (err) {
        console.error("Erro no status:", err)
      }

    }, 2000)

    intervalRef.current = interval
  }

  async function baixarResultado() {

    if (!job?.job_id) return

    setBaixando(true)

    try {
      await downloadRouting(job.job_id)
    } catch (err) {
      console.error(err)
    } finally {
      setBaixando(false)
    }
  }

  async function gerarMapa() {

    if (!job?.job_id) return

    setGerandoMapa(true)

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

    } finally {

      setGerandoMapa(false)

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
      
      <div className="border rounded-lg p-4 space-y-3 max-w-3xl">

        <h4 className="text-sm font-semibold text-gray-700">
          Parâmetros da roteirização
        </h4>

        <div className="grid grid-cols-2 gap-3">

          <input
            type="number"
            placeholder="Dias úteis"
            value={params.dias_uteis}
            onChange={(e) =>
              setParams({ ...params, dias_uteis: Number(e.target.value) })
            }
            className="border px-3 py-2 rounded text-sm"
          />

          <input
            type="number"
            placeholder="Frequência visita"
            value={params.freq_visita}
            onChange={(e) =>
              setParams({ ...params, freq_visita: Number(e.target.value) })
            }
            className="border px-3 py-2 rounded text-sm"
          />

          <input
            type="number"
            placeholder="Mín PDVs"
            value={params.min_pdvs_rota}
            onChange={(e) =>
              setParams({ ...params, min_pdvs_rota: Number(e.target.value) })
            }
            className="border px-3 py-2 rounded text-sm"
          />

          <input
            type="number"
            placeholder="Máx PDVs"
            value={params.max_pdvs_rota}
            onChange={(e) =>
              setParams({ ...params, max_pdvs_rota: Number(e.target.value) })
            }
            className="border px-3 py-2 rounded text-sm"
          />

        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.aplicar_two_opt}
            onChange={(e) =>
              setParams({ ...params, aplicar_two_opt: e.target.checked })
            }
          />
          Otimização 2-opt
        </label>

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

          {job && job.status !== "finished" && job.status !== "failed" && (
            <div className="text-xs text-blue-600 flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Processando em background...
            </div>
          )}

          {job.status === "finished" && (

            <div className="flex gap-3">

              <button
                onClick={baixarResultado}
                disabled={baixando}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:bg-gray-400"
              >
                {baixando && <span className="animate-spin">⬇️</span>}
                {baixando ? "Baixando..." : "Baixar resultado"}
              </button>

              {!mapLoaded && (
                <button
                  onClick={gerarMapa}
                  disabled={gerandoMapa}
                  className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:bg-gray-400"
                >
                  {gerandoMapa && <span className="animate-spin">🗺️</span>}
                  {gerandoMapa ? "Gerando mapa..." : "Gerar mapa"}
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