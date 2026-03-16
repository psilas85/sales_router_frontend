//sales_router_frontend/components/maps/GeocodeMap.tsx

"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

type Props = {
  pontos: {
    lat: number
    lon: number
    endereco?: string
  }[]
}

export default function GeocodeMap({ pontos }: Props) {

  if (!pontos || pontos.length === 0) return null

  const center = [pontos[0].lat, pontos[0].lon] as [number, number]

  return (

    <div className="h-96 w-full rounded overflow-hidden border">

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pontos.map((p, i) => (

          <Marker
            key={i}
            position={[p.lat, p.lon]}
          >
            <Popup>
              {p.endereco || "Ponto geocodificado"}
            </Popup>
          </Marker>

        ))}

      </MapContainer>

    </div>

  )

}