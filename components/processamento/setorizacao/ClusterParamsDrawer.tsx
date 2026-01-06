//sales_router_frontend/components/processamento/setorizacao/ClusterParamsDrawer.tsx

"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ClusterParamsDrawer({
  open,
  onClose,
  children,
}: Props) {
  // 🔔 escuta evento global para fechar automaticamente
  useEffect(() => {
    const fechar = () => onClose();
    window.addEventListener("fechar-progresso-cluster", fechar);

    return () => {
      window.removeEventListener("fechar-progresso-cluster", fechar);
    };
  }, [onClose]);

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
            Parâmetros da Clusterização
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
