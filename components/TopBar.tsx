// sales_router_frontend/components/TopBar.tsx

"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Users,
  Building2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export default function TopBar() {
  const [open, setOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const role = user?.role;
  const canManageUsers =
    role === "sales_router_adm" || role === "tenant_adm";
  const canManageTenants = role === "sales_router_adm";

  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-white border-b z-50 flex items-center justify-between px-6">
      {/* LOGO À ESQUERDA */}
      <Link href="/home" className="flex items-center">
        <img
          src="/salesrouter-logo.png"
          className="h-10 md:h-11 object-contain"
        />

      </Link>

      {/* AÇÕES À DIREITA */}
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-neutral-soft"
        >
          <Settings size={16} />
          Configurações
        </button>

        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          Sair
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-xl shadow-lg overflow-hidden">
            <Link
              href="/config/conta"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-soft"
            >
              <User size={16} />
              Minha Conta
            </Link>

            {canManageUsers && (
              <Link
                href="/config/usuarios"
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-soft"
              >
                <Users size={16} />
                Usuários
              </Link>
            )}

            {canManageTenants && (
              <Link
                href="/config/tenants"
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-soft"
              >
                <Building2 size={16} />
                Tenants
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
