//sales_router_frontend/app/%28dashboard%29/dados/mapas/[input_id]/page.tsx

// sales_router_frontend/app/(dashboard)/dados/mapas/[input_id]/page.tsx

"use client";

import { useState } from "react";
import { gerarMapa, baixarMapa, abrirMapaNavegador } from "@/services/pdv";
import { useParams } from "next/navigation";
import { MapPinned, Loader2, Download, Globe } from "lucide-react";

export default function MapaPorInputIDPage() {
  const { input_id } = useParams() as { input_id: string };

  const [loadingGerar, setLoadingGerar] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [mapUrlRelativa, setMapUrlRelativa] = useState<string | null>(null);

  // ============================================================
  // GERAR MAPA
  // ============================================================
  async function handleGerar() {
    try {
      setLoadingGerar(true);
      setMensagem(null);

      const res = await gerarMapa(input_id);

      setMensagem("Mapa gerado com sucesso!");
      setMapUrlRelativa(res.url_relativa);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao gerar mapa.");
    } finally {
      setLoadingGerar(false);
    }
  }

  // ============================================================
  // DOWNLOAD
  // ============================================================
  async function handleDownload() {
    try {
      setLoadingDownload(true);
      setMensagem(null);

      await baixarMapa(input_id);
      setMensagem("Download iniciado.");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao baixar.");
    } finally {
      setLoadingDownload(false);
    }
  }

  // ============================================================
  // ABRIR NO NAVEGADOR
  // ============================================================
  function handleAbrir() {
    // sempre precisa existir o arquivo
    if (!mapUrlRelativa) {
      alert("Gere o mapa primeiro.");
      return;
    }

    // URL do gateway
    const gateway =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://34.227.175.23";

    const url = `${gateway}${mapUrlRelativa}`;
    window.open(url, "_blank");
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-brand mb-10 flex items-center gap-3">
        <MapPinned className="text-brand h-10 w-10" />
        Mapa – Input ID
      </h1>

      <div className="bg-white rounded-2xl shadow-xl p-10 border space-y-6">
        {/* Input ID */}
        <div className="text-lg">
          <strong>Input ID:</strong>{" "}
          <span className="font-mono text-sm">{input_id}</span>
        </div>

        {/* MENSAGEM */}
        {mensagem && (
          <div className="p-3 rounded-lg bg-brand-soft text-brand font-medium">
            {mensagem}
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex flex-wrap gap-4 mt-4">

          {/* VOLTAR */}
          <button
            onClick={() => (window.location.href = "/dados/mapas")}
            className="flex items-center gap-2 border border-gray-300 px-5 py-3 rounded-xl hover:bg-gray-100"
          >
            ⬅️ Voltar
          </button>

          {/* GERAR */}
          <button
            onClick={handleGerar}
            disabled={loadingGerar}
            className="flex items-center gap-2 bg-brand text-white px-5 py-3 rounded-xl shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {loadingGerar ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <MapPinned className="h-5 w-5" />
            )}
            Gerar Mapa
          </button>

          {/* DOWNLOAD */}
          <button
            onClick={handleDownload}
            disabled={loadingDownload}
            className="flex items-center gap-2 border border-brand text-brand px-5 py-3 rounded-xl hover:bg-brand-soft disabled:opacity-60"
          >
            {loadingDownload ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            Download
          </button>

          {/* ABRIR NO NAVEGADOR */}
          <button
            onClick={handleAbrir}
            className="flex items-center gap-2 border border-gray-400 px-5 py-3 rounded-xl hover:bg-gray-100"
          >
            <Globe className="h-5 w-5" />
            Abrir no navegador
          </button>
        </div>

        {/* STATUS */}
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Status do Mapa</h2>

          {mapUrlRelativa ? (
            <div>
              <p className="mb-2 text-green-700 font-medium">Mapa disponível.</p>
              <code className="block p-3 bg-gray-100 rounded">
                {mapUrlRelativa}
              </code>
            </div>
          ) : (
            <p className="text-gray-600">Nenhum mapa gerado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
