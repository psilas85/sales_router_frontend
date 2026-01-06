// sales_router_frontend/components/SideBar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers3, Clock, Menu } from "lucide-react";
import { useLayoutStore } from "@/store/useLayoutStore";

export default function SideBar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();

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
        ${sidebarCollapsed ? "w-16" : "w-52 "}
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

      {/* MENUS */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        <MenuItem
          href="/home"
          label="Home"
          icon={<Home size={20} />}
          active={isActive("/home")}
          collapsed={sidebarCollapsed}
        />

        <MenuItem
          href="/processamento?tab=entrada"
          label="Processamento"
          icon={<Layers3 size={20} />}
          active={isActive("/processamento")}
          collapsed={sidebarCollapsed}
        />

        <MenuItem
          href="/historico"
          label="Histórico"
          icon={<Clock size={20} />}
          active={isActive("/historico")}
          collapsed={sidebarCollapsed}
        />
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
