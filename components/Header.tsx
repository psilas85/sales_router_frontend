// sales_router_frontend/components/Header.tsx

"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="w-full h-20 bg-white flex items-center justify-between px-8 shadow-sm border-b">
      <h1 className="text-2xl font-semibold text-gray-700">SalesRouter</h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
      >
        <LogOut size={18} />
        Sair
      </button>
    </header>
  );
}
