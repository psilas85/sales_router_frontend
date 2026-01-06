//sales_router_frontend/components/MenuItem.tsx

"use client";

import Link from "next/link";

export default function MenuItem({ icon, label, href, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium
      ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}
    `}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
