"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "/marker.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapaBase({ pontos }: { pontos: any[] }) {
  const validos = pontos.filter(
    (p) => p.lat !== null && p.lon !== null && !isNaN(p.lat) && !isNaN(p.lon)
  );

  const center =
    validos.length > 0
      ? [validos[0].lat, validos[0].lon]
      : [-23.55, -46.63]; // fallback SP

  return (
    <MapContainer
      center={center as any}
      zoom={10}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validos.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lon]} icon={icon}>
          <Popup>
            <strong>{p.nome}</strong>
            <br />
            {p.endereco}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
