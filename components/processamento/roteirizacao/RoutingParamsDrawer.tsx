//sales_router_frontend/components/processamento/roteirizacao/RoutingParamsDrawer.tsx

"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function RoutingParamsDrawer({ open, onClose, children }: Props) {
  // (mesmo padrão do ClusterParamsDrawer)
  useEffect(() => {
    const fechar = () => onClose();
    window.addEventListener("fechar-progresso-routing", fechar);
    return () => window.removeEventListener("fechar-progresso-routing", fechar);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />

      <div className="w-[520px] max-w-full bg-white h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Parâmetros da Roteirização</h2>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
