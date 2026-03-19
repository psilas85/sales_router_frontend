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
import { useState } from "react";

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

  const [hoverCluster, setHoverCluster] = useState<string | null>(null)
  const [hoverRota, setHoverRota] = useState<string | null>(null)

  const validos = pontos.filter(
    (p) =>
      p.lat !== null &&
      p.lon !== null &&
      !isNaN(p.lat) &&
      !isNaN(p.lon)
  )

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

      {geojson && (
        <GeoJSON
          data={geojson}

          style={(feature: any) => {

            if (feature?.geometry?.type !== "LineString") return {}

            const rotaId = feature?.properties?.rota_id
            const cluster = feature?.properties?.cluster

            let visible = true

            if (hoverRota) {
              visible = rotaId === hoverRota
            } else if (hoverCluster) {
              visible = cluster === hoverCluster
            }

            return {
              color: feature?.properties?.color,
              weight: visible ? 5 : 1,
              opacity: visible ? 1 : 0.08
            }
          }}

          pointToLayer={(feature: any, latlng: any) => {

            if (feature?.properties?.tipo === "centro") {

              const cluster = feature?.properties?.cluster

              let visible = true

              if (hoverCluster) {
                visible = cluster === hoverCluster
              }

              return L.circleMarker(latlng, {
                radius: visible ? 9 : 6,
                color: "#000",
                fillColor: feature?.properties?.color,
                fillOpacity: visible ? 1 : 0.3
              })
            }

            return L.circleMarker(latlng, {
              radius: 3,
              color: "#999"
            })
          }}

          onEachFeature={(feature: any, layer: any) => {

            const rotaId = feature?.properties?.rota_id
            const cluster = feature?.properties?.cluster
            const tipo = feature?.properties?.tipo
            const consultor = feature?.properties?.consultor

            // hover rota
            if (feature.geometry.type === "LineString") {
              layer.on({
                mouseover: () => setHoverRota(rotaId),
                mouseout: () => setHoverRota(null)
              })
            }

            // base
            if (tipo === "centro") {

              layer.bindPopup(`
                <div style="font-size:12px">
                  <strong>${consultor || "Consultor"}</strong><br/>
                  Setor: ${cluster}
                </div>
              `)

              layer.on({
                mouseover: () => setHoverCluster(cluster),
                mouseout: () => setHoverCluster(null)
              })
            }

          }}

        />
      )}

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