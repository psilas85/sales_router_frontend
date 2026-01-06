//sales_router_frontend/components/ui/CollapsibleSection.tsx

"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 border-b hover:bg-gray-50"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {open ? <ChevronDown /> : <ChevronRight />}
      </button>

      {open && <div className="p-6">{children}</div>}
    </div>
  );
}
