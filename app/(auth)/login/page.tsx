// sales_router_frontend/app/(auth)/login/page.tsx

// sales_router_frontend/app/(auth)/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const ok = await login(email, senha);

    if (ok) {
      router.push("/home");
    }
  }


  return (
    <div className="flex w-full justify-center items-center min-h-screen px-4">
      <div
        className="
          w-full max-w-6xl
          bg-white
          rounded-[28px]
          overflow-hidden
          flex
          shadow-[0_30px_80px_rgba(0,0,0,0.35)]
        "
      >
        {/* =========================
            PAINEL ESQUERDO — MARCA
           ========================= */}
        <div
          className="
            hidden md:flex
            w-7/12
            bg-gradient-to-br
            from-white
            via-[#f3f6fb]
            to-[#e9eef6]
            items-center
            justify-center
            flex-col
            px-16
            text-center
          "
        >
          {/* Wrapper para controle fino */}
          <div className="flex flex-col items-center">
            <img
              src="/salesrouter-logo.png"
              alt="SalesRouter"
              className="w-[320px] drop-shadow-sm"
            />

            {/* ✅ SÓ O SLOGAN SOBE (sem mexer no logo) */}
            <p className="mt-4 text-xl font-semibold text-gray-700 leading-relaxed max-w-md">
              Inteligência em Setorização<br />
              e Roteirização de Vendas
            </p>
          </div>
        </div>

        {/* =========================
            PAINEL DIREITO — LOGIN
           ========================= */}
        <div
          className="
            w-full md:w-5/12
            p-12
            flex
            flex-col
            justify-center
            bg-white
          "
        >
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
            Acessar Conta
          </h2>

          

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 text-sm mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700 text-sm mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="input-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Entrando..." : "Entrar"}
            </button>


            {error && (
              <p className="text-red-600 text-center text-sm mt-2">{error}</p>
            )}
          </form>

          <div className="mt-10 text-center text-xs text-gray-400">
            © 2025 SalesRouter · Todos os direitos reservados
          </div>
        </div>
      </div>
    </div>
  );
}
