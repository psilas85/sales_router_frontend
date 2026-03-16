//sales_router_frontend/components/maps/GeocodeResultMap.tsx

"use client"

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type Ponto = {
  lat: number
  lon: number
  cidade?: string
  setor?: string
  endereco?: string
}

function FitBounds({ pontos }: { pontos: Ponto[] }) {

  const map = useMap()

  useEffect(() => {

    if (!pontos?.length) return

    const bounds = L.latLngBounds(
      pontos.map(p => [p.lat, p.lon] as [number, number])
    )

    map.fitBounds(bounds, {
      padding: [40, 40]
    })

  }, [pontos, map])

  return null
}

export default function GeocodeResultMap({ pontos }: { pontos: Ponto[] }) {

  if (!pontos?.length) return null

  // =========================================================
  // LIMITAR A 1000 PONTOS ALEATÓRIOS
  // =========================================================

  let pontosMapa = pontos

  if (pontos.length > 1000) {

    const shuffled = [...pontos].sort(() => 0.5 - Math.random())

    pontosMapa = shuffled.slice(0, 1000)

  }

  // =========================================================
  // DEFINIR AGRUPAMENTO
  // =========================================================

  const useSetor = pontosMapa.every(
    p => p.setor && p.setor.trim() !== ""
  )

  const key = useSetor ? "setor" : "cidade"

  const categories = Array.from(
    new Set(
      pontosMapa.map(p => String(p[key as keyof Ponto] ?? "outros"))
    )
  )

  // =========================================================
  // CORES
  // =========================================================

  const colors = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#7c3aed",
    "#0891b2",
    "#ea580c",
    "#4f46e5",
    "#be123c",
    "#15803d"
  ]

  const colorMap: Record<string, string> = {}

  categories.forEach((c, i) => {
    colorMap[c] = colors[i % colors.length]
  })

  const center: [number, number] = [
    pontosMapa[0].lat,
    pontosMapa[0].lon
  ]

  return (

    <div className="h-[500px] w-full border rounded">

      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >

        <FitBounds pontos={pontosMapa} />

        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pontosMapa.map((p, i) => {

          const categoria = String(
            p[key as keyof Ponto] ?? "outros"
          )

          return (

            <CircleMarker
              key={i}
              center={[p.lat, p.lon]}
              radius={3}
              pathOptions={{
                color: colorMap[categoria],
                fillOpacity: 0.8
              }}
            >

              <Popup>

                {p.setor && (
                  <div>
                    <b>Setor:</b> {p.setor}
                  </div>
                )}

                {p.cidade && (
                  <div>
                    <b>Cidade:</b> {p.cidade}
                  </div>
                )}

                <div>
                  {p.endereco || "Endereço não informado"}
                </div>

              </Popup>

            </CircleMarker>

          )

        })}

      </MapContainer>

    </div>

  )

}