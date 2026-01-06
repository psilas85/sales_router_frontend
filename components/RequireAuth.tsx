//sales_router_frontend/components/RequireAuth.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (token === null) return;      // evita redirect antes do load
    if (!token) router.push("/login");
  }, [token]);

  if (!token || !user) return <div>Carregando...</div>;

  return <>{children}</>;
}
