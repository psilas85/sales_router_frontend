//sales_router_frontend/src/app/(dashboard)/config/conta/page.tsx

"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Title from "@/components/Title";

export default function ContaPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <div className="p-8">
        <Title>Minha Conta</Title>
        <div className="bg-white rounded-xl shadow p-6">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Title>Minha Conta</Title>

      <div className="bg-white rounded-xl shadow p-6 max-w-lg space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">E-mail</span>
          <span className="font-medium">{user.email}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Perfil</span>
          <span className="font-medium">{user.role}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Cliente ID</span>
          <span className="font-medium">{user.tenant_id}</span>
        </div>
      </div>
    </div>
  );
}
