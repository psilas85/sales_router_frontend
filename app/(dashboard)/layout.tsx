//sales_router_frontend/app/(dashboard)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";

import { useAuthStore } from "@/store/useAuthStore";
import { useLayoutStore } from "@/store/useLayoutStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, loading, loadUser } = useAuthStore();
  const { sidebarCollapsed } = useLayoutStore();

  useEffect(() => {
    loadUser();
  }, []);

  // ⛔ Ainda carregando usuário → não renderiza nada
  if (loading) {
    return null; // ou spinner se quiser
  }

  // 🔐 Não autenticado → login
  if (!user) {
    router.replace("/login");
    return null;
  }

  // ✅ Autenticado → dashboard normal
  return (
    <div className="flex min-h-screen bg-neutral-bg">
      <SideBar />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <TopBar />

        <main className="pt-14 px-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
