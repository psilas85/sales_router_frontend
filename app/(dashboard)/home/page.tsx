"use client";

import Link from "next/link";
import { Brain, Settings2, Upload, Layers3, Route } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Bem-vindo 👋</h1>
        <p className="text-gray-500">
          Escolha como deseja trabalhar: simulação inteligente ou execução direta.
        </p>
      </div>

      {/* ================= SIMULADOR ================= */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="text-blue-600" size={20} />
            Simulação Inteligente
          </h2>
          <p className="text-sm text-gray-500">
            O sistema define automaticamente territórios e rotas ideais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/simulador?tab=entrada">
            <div className="card card-clickable">
              <Upload className="text-blue-600 mb-3" />
              <h3 className="font-semibold">Upload de Dados</h3>
              <p className="text-sm text-gray-500">
                Envie a base para iniciar a simulação
              </p>
            </div>
          </Link>

          <Link href="/simulador?tab=setorizacao">
            <div className="card card-clickable">
              <Layers3 className="text-blue-600 mb-3" />
              <h3 className="font-semibold">Setorização automática</h3>
              <p className="text-sm text-gray-500">
                Geração automática de territórios
              </p>
            </div>
          </Link>

          <Link href="/simulador?tab=roteirizacao">
            <div className="card card-clickable">
              <Route className="text-blue-600 mb-3" />
              <h3 className="font-semibold">Roteirização automática</h3>
              <p className="text-sm text-gray-500">
                Rotas otimizadas automaticamente
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* ================= PROCESSOS AVULSOS ================= */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings2 className="text-orange-600" size={20} />
            Execução Operacional
          </h2>
          <p className="text-sm text-gray-500">
            Utilize dados já definidos para executar geocodificação e rotas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/processos-avulsos" className="card">
            <h3 className="font-semibold">Geocodificação</h3>
            <p className="text-sm text-gray-500">
              Converter endereços em coordenadas
            </p>
          </Link>

          <Link href="/processos-avulsos/roteirizacao" className="card">
            <h3 className="font-semibold">Roteirização por setores</h3>
            <p className="text-sm text-gray-500">
              Gerar rotas com setores já definidos
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}