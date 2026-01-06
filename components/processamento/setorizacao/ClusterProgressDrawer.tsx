//sales_router_frontend/components/processamento/setorizacao/ClusterProgressDrawer.tsx

"use client";

import { X } from "lucide-react";
import ProgressoSetorizacao from "./ProgressoSetorizacao";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ClusterProgressDrawer({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* OVERLAY */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="w-[520px] max-w-full bg-white h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Progresso da Clusterização
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X />
          </button>
        </div>

        <div className="p-6">
          <ProgressoSetorizacao />
        </div>
      </div>
    </div>
  );
}
