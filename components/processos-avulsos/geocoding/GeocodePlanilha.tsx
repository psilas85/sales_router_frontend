//sales_router_frontend/components/processos-avulsos/geocoding/GeocodePlanilha.tsx

"use client"

import { useState, useRef, useEffect } from "react"
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

  const intervalRef = useRef<any>(null)

  const [uploading, setUploading] = useState(false)
  const [gerandoMapa, setGerandoMapa] = useState(false)

  const [baixandoResultado, setBaixandoResultado] = useState(false)

  // =========================
  // 🔥 RECUPERA JOB AO ENTRAR NA TELA
  // =========================
  useEffect(() => {

    const jobId = localStorage.getItem("geocode_job_id")

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

    localStorage.removeItem("geocode_job_id")

    setFile(null)
    setJob(null)
    setResumo(null)
    setPontosMapa([])
    setMapLoaded(false)
    setLoading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
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

    setUploading(true)

    try {

      const res = await uploadGeocode(file)

      localStorage.setItem("geocode_job_id", res.job_id)

      setJob({
        job_id: res.job_id,
        status: "queued",
        progress: 0,
        step: "Enfileirado"
      })

      acompanhar(res.job_id)

    } catch (err) {

      console.error(err)

    } finally {

      setUploading(false)

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

        const status = await jobStatus(job_id)

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

          if (status.result) {
            setResumo({
              total: status.result.total,
              sucesso: status.result.sucesso,
              falhas: status.result.falhas
            })
          }

          localStorage.removeItem("geocode_job_id")

          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          setLoading(false)
        }

      } catch (err) {
        console.error("Erro ao consultar status", err)
      }

    }, 2000)

    intervalRef.current = interval
  }
  
  async function baixarResultado() {
    if (!job?.job_id) return

    setBaixandoResultado(true)

    try {
      await downloadGeocode(job.job_id)
    } catch (err) {
      console.error("Erro ao baixar resultado", err)
    } finally {
      setBaixandoResultado(false)
    }
  }
    
  async function gerarMapa() {

    if (!job?.job_id) return

    setGerandoMapa(true)

    try {

      const res = await api.get(`/geocode/api/v1/job/${job.job_id}/result`)

      const sample = sampleRandom(res.data, 1000)

      setPontosMapa(sample)
      setMapLoaded(true)

    } catch (err) {

      console.error("Erro ao carregar pontos para mapa", err)

    } finally {

      setGerandoMapa(false)

    }

  }

  return (

    <div className="space-y-8">

      <div>

        <h3 className="text-lg font-semibold">
          Geocodificação em Lote
        </h3>

        <p className="text-sm text-gray-500">
          Envie uma planilha para geocodificar múltiplos endereços.
        </p>

      </div>

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
          disabled={!file || uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading && <span className="animate-spin">⏳</span>}
          {uploading ? "Enviando..." : "Enviar planilha"}
        </button>

        <a
          href="/templates/geocodificacao_operacional_upload.xlsx"
          target="_blank"
          title="Baixar modelo padrão para geocodificação"
          className="px-4 py-2 border rounded text-sm text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          Baixar template
        </a>

        {job && (
          <button
            onClick={resetar}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            Novo upload
          </button>
        )}

      </div>

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

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${job.progress ?? 0}%` }}
            />

          </div>

          <div className="text-xs text-gray-500">
            {job.progress ?? 0}% concluído
          </div>

        
          {job && job.status !== "finished" && job.status !== "failed" && (
            <div className="text-xs text-blue-600">
              🔄 Processando em background...
            </div>
          )}

          {resumo && (

            <div className="grid grid-cols-3 gap-3 pt-2">

              <ResumoBox label="Total" value={resumo.total ?? 0} />

              <ResumoBox label="Geocodificados" value={resumo.sucesso ?? 0} green />

              <ResumoBox label="Inválidos" value={resumo.falhas ?? 0} red />

            </div>

          )}

          {job.status === "finished" && (

            <div className="flex gap-3 pt-2">

              <button
                onClick={baixarResultado}
                disabled={baixandoResultado}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {baixandoResultado && <span className="animate-spin">⬇️</span>}
                {baixandoResultado ? "Baixando..." : "Baixar resultado"}
              </button>

              {!mapLoaded && (

                <button
                  onClick={gerarMapa}
                  disabled={gerandoMapa}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm flex items-center gap-2 disabled:bg-gray-400"
                >
                  {gerandoMapa && <span className="animate-spin">🗺️</span>}
                  {gerandoMapa ? "Gerando mapa..." : "Gerar mapa"}
                </button>

              )}

            </div>

          )}

        </div>

      )}

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

      <p className="text-xs">{label}</p>

      <p className="text-lg font-semibold">{value}</p>

    </div>

  )

}