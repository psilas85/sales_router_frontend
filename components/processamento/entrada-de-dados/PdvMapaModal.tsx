//sales_router_frontend/app/%28dashboard%29/dados/locais/pdv-mapa-modal.tsx

"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";
import L from "leaflet";
import { PDVLocal } from "@/services/pdv";
import "leaflet/dist/leaflet.css";

// -------------------------------------------------------------------
// FIX DEFINITIVO ÍCONE LEAFLET (Next.js)
// -------------------------------------------------------------------
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// -------------------------------------------------------------------
// Imports dinâmicos do React-Leaflet
// -------------------------------------------------------------------
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function MapaModal({
  ponto,
  onClose,
}: {
  ponto: PDVLocal;
  onClose: () => void;
}) {
  const lat = Number(ponto.pdv_lat);
  const lon = Number(ponto.pdv_lon);

  // --------------------------------------------------------------
  // Coordenadas inválidas
  // --------------------------------------------------------------
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return (
      <div className="modal-bg z-50">
        <div className="modal-card max-w-lg">
          <h2 className="text-xl font-semibold text-red-600">
            Coordenadas inválidas
          </h2>
          <p className="text-gray-700 mt-2">
            Este local não possui latitude/longitude válidas.
          </p>

          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="btn-primary">
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // Modal com mapa
  // --------------------------------------------------------------
  return (
    <div className="modal-bg z-50">
      <div className="modal-card w-[90%] max-w-3xl animate-fade-in">

        {/* FECHAR */}
        <button onClick={onClose} className="modal-close">
          <X size={26} />
        </button>

        <h2 className="text-2xl font-semibold text-brand mb-4">
          Localização — {ponto.cnpj}
        </h2>

        <div className="w-full h-[450px] rounded-xl overflow-hidden border border-neutral-border">
          <MapContainer
            center={[lat, lon]}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* NÃO PASSE icon={} */}
            <Marker position={[lat, lon]}>
              <Popup>{ponto.endereco_completo}</Popup>
            </Marker>
          </MapContainer>
        </div>

      </div>
    </div>
  );
}
