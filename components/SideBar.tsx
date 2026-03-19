// sales_router_frontend/components/SideBar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers3,
  Clock,
  Menu,
  Users,
  Folder,
  Zap,
  MapPin
} from "lucide-react";

import { useLayoutStore } from "@/store/useLayoutStore";
import { useState } from "react";

export default function SideBar() {

  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();

  const [cadastrosOpen, setCadastrosOpen] = useState(
    pathname.startsWith("/cadastros")
  );

  const [processosOpen, setProcessosOpen] = useState(
    pathname.startsWith("/processos-avulsos")
  );

  function isActive(path: string) {
    return pathname.startsWith(path);
  }

  return (

    <aside
      className={`
        fixed
        left-0
        top-12
        bg-white
        border-r
        shadow-sm
        transition-all
        duration-300
        ${sidebarCollapsed ? "w-16" : "w-52"}
        h-[calc(100vh-3rem)]
        flex
        flex-col
      `}
    >

      {/* BOTÃO COLAPSAR */}
      <div className="flex justify-end px-3 py-3 border-b">

        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700"
        >
          <Menu size={18} />
        </button>

      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-2">

        {/* HOME */}
        <MenuItem
          href="/home"
          label="Home"
          icon={<Home size={20} />}
          active={isActive("/home")}
          collapsed={sidebarCollapsed}
        />

        {/* SIMULADOR */}
        <MenuItem
          href="/simulador?tab=entrada"
          label="Simulação Inteligente"
          icon={<Layers3 size={20} />}
          active={isActive("/simulador")}
          collapsed={sidebarCollapsed}
        />


        {/* PROCESSOS AVULSOS */}
        <div>

          <button
            onClick={() => setProcessosOpen(!processosOpen)}
            className={`
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2
              rounded-lg
              text-sm
              transition
              ${
                isActive("/processos-avulsos")
                  ? "bg-brand.soft text-brand.secondary font-semibold"
                  : "text-gray-700 hover:bg-neutral-soft"
              }
            `}
          >

            <Zap size={20} />

            {!sidebarCollapsed && (
              <>
                <span className="flex-1 text-left">
                  Execução Operacional
                </span>

                <span className="text-xs">
                  {processosOpen ? "▾" : "▸"}
                </span>
              </>
            )}

          </button>

          {/* SUBMENU */}
          {processosOpen && !sidebarCollapsed && (

            <div className="ml-7 mt-1 space-y-1">

              <MenuItem
                href="/processos-avulsos"
                label="Geocodificação"
                icon={<MapPin size={18} />}
                active={isActive("/processos-avulsos")}
                collapsed={false}
              />

              <MenuItem
                href="/processos-avulsos/roteirizacao"
                label="Roteirização"
                icon={<MapPin size={18} />}
                active={pathname.includes("tab=routing")}
                collapsed={false}
              />

            </div>

          )}

        </div>

        {/* CADASTROS */}
        <div>

          <button
            onClick={() => setCadastrosOpen(!cadastrosOpen)}
            className={`
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2
              rounded-lg
              text-sm
              transition
              ${
                isActive("/cadastros")
                  ? "bg-brand.soft text-brand.secondary font-semibold"
                  : "text-gray-700 hover:bg-neutral-soft"
              }
            `}
          >

            <Folder size={20} />

            {!sidebarCollapsed && (
              <>
                <span className="flex-1 text-left">
                  Cadastros
                </span>

                <span className="text-xs">
                  {cadastrosOpen ? "▾" : "▸"}
                </span>
              </>
            )}

          </button>

          {/* SUBMENU */}
          {cadastrosOpen && !sidebarCollapsed && (

            <div className="ml-7 mt-1 space-y-1">

              <MenuItem
                href="/cadastros/consultores"
                label="Consultores"
                icon={<Users size={18} />}
                active={isActive("/cadastros/consultores")}
                collapsed={false}
              />

            </div>

          )}

        </div>

      </nav>

    </aside>

  );

}


function MenuItem({
  href,
  label,
  icon,
  active,
  collapsed,
}: any) {

  return (

    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
        ${
          active
            ? "bg-brand.soft text-brand.secondary font-semibold"
            : "text-gray-700 hover:bg-neutral-soft"
        }
      `}
    >

      {icon}

      {!collapsed && <span>{label}</span>}

    </Link>

  );

}