//sales_router_frontend/components/MapaBase.tsx

"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "/marker.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  pontos?: any[]
  geojson?: any
}

export default function MapaBase({ pontos = [], geojson }: Props) {

  const validos = pontos.filter(
    (p) =>
      p.lat !== null &&
      p.lon !== null &&
      !isNaN(p.lat) &&
      !isNaN(p.lon)
  )

  // prioridade: geojson
  let center: [number, number] = [-23.55, -46.63]

  if (geojson?.features?.length) {

    const first = geojson.features.find((f: any) =>
      f.geometry?.coordinates
    )

    if (first) {
      const coords = first.geometry.coordinates

      if (first.geometry.type === "LineString") {
        center = [coords[0][1], coords[0][0]]
      }

      if (first.geometry.type === "Point") {
        center = [coords[1], coords[0]]
      }
    }

  } else if (validos.length > 0) {
    center = [validos[0].lat, validos[0].lon]
  }

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* =========================
          GEOJSON (ROTAS)
      ========================= */}
      {geojson && (
        <GeoJSON
          data={geojson}
          style={(feature) => {

            if (feature?.geometry?.type === "LineString") {
              return {
                color: "#2563eb",
                weight: 4
              }
            }

            return {}
          }}
        />
      )}

      {/* =========================
          PONTOS (LEGADO)
      ========================= */}
      {validos.map((p, i) => (
        <Marker
          key={i}
          position={[p.lat, p.lon]}
          icon={icon}
        >
          <Popup>
            <strong>{p.nome || "Ponto"}</strong>
            <br />
            {p.endereco || ""}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}