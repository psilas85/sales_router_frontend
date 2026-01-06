//sales_router_frontend/components/processamento/LocaisTab.tsx
"use client";

import { useState } from "react";
import {
  buscarLocais,
  editarLocal,
  excluirLocal,
  PDVLocal,
  PDVLocalEdicao,
} from "@/services/pdv";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import { Map, ChevronLeft, ChevronRight, X } from "lucide-react";

const MapaModal = dynamic(() => import("./PdvMapaModal"), { ssr: false });

export default function LocaisTab() {
  // -------------------------
  // FILTROS
  // -------------------------
  const [inputId, setInputId] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");

  const filtrosValidos =
    inputId && uf && (cidade || cnpj || logradouro || bairro || cep);

  // -------------------------
  // RESULTADOS
  // -------------------------
  const [lista, setLista] = useState<PDVLocal[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // -------------------------
  // EDIÇÃO
  // -------------------------
  const [editando, setEditando] = useState<PDVLocal | null>(null);

  // -------------------------
  // MAPA
  // -------------------------
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [pontoSelecionado, setPontoSelecionado] =
    useState<PDVLocal | null>(null);

  // -------------------------
  // PAGINAÇÃO
  // -------------------------
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const totalPaginas = Math.ceil(lista.length / porPagina);
  const exibidos = lista.slice((pagina - 1) * porPagina, pagina * porPagina);

  // -------------------------
  // BUSCAR
  // -------------------------
  async function buscar() {
    try {
      setErro("");
      setCarregando(true);
      setPagina(1);

      const params: any = { input_id: inputId, uf };
      if (cidade) params.cidade = cidade;
      if (cnpj) params.cnpj = cnpj;
      if (logradouro) params.logradouro = logradouro;
      if (bairro) params.bairro = bairro;
      if (cep) params.cep = cep;

      const res = await buscarLocais(params);
      setLista(res.pdvs || []);
    } catch {
      setErro("Erro ao buscar locais.");
    } finally {
      setCarregando(false);
    }
  }

  // -------------------------
  // SALVAR
  // -------------------------
  async function salvarEdicao() {
    if (!editando) return;

    const payload: PDVLocalEdicao = {
      id: editando.id,
      logradouro: editando.logradouro,
      numero: editando.numero,
      bairro: editando.bairro,
      cidade: editando.cidade,
      uf: editando.uf,
      cep: editando.cep,
      pdv_lat: Number(editando.pdv_lat),
      pdv_lon: Number(editando.pdv_lon),
    };

    try {
      await editarLocal(payload);
      setLista((old) =>
        old.map((p) => (p.id === editando.id ? editando : p))
      );
      setEditando(null);
    } catch {
      alert("Erro ao salvar.");
    }
  }

  // -------------------------
  // EXCLUIR
  // -------------------------
  async function excluir(id: number) {
    if (!confirm("Deseja realmente excluir este local?")) return;
    try {
      await excluirLocal(id);
      setLista((old) => old.filter((p) => p.id !== id));
    } catch {
      alert("Erro ao excluir.");
    }
  }

  return (
    <div className="space-y-6">
      {/* FILTROS COMPACTOS */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            placeholder="Input ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="">UF</option>
            {[
              "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
              "MG","MS","MT","PA","PB","PE","PI","PR","RJ",
              "RN","RO","RR","RS","SC","SE","SP","TO",
            ].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          <input
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <input
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <input
            placeholder="Logradouro"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <input
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <input
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <div className="flex items-end">
            <button
              onClick={buscar}
              disabled={!filtrosValidos}
              className={`w-full px-4 py-2 rounded-md text-sm text-white bg-brand ${
                !filtrosValidos && "opacity-40 cursor-not-allowed"
              }`}
            >
              Buscar
            </button>
          </div>
        </div>

        {erro && <p className="text-red-600 text-sm mt-2">{erro}</p>}
      </div>

      {/* RESULTADOS */}
      {carregando && <p>Carregando...</p>}

      {lista.length > 0 && !carregando && (
        <>
          <div className="overflow-x-auto border rounded-xl shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">CNPJ</th>
                  <th className="p-2 text-left">Endereço</th>
                  <th className="p-2 text-center">Lat</th>
                  <th className="p-2 text-center">Lon</th>
                  <th className="p-2 text-center">Mapa</th>
                  <th className="p-2 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {exibidos.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`border-t ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-2">{p.cnpj}</td>
                    <td className="p-2">{p.endereco_completo}</td>
                    <td className="p-2 text-center">{p.pdv_lat}</td>
                    <td className="p-2 text-center">{p.pdv_lon}</td>

                    <td className="p-2 text-center">
                      <button
                        onClick={() => {
                          setPontoSelecionado(p);
                          setMostrarMapa(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Map size={16} />
                      </button>
                    </td>

                    <td className="p-2 text-center">
                      <button
                        onClick={() => setEditando(p)}
                        className="text-blue-600 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluir(p.id)}
                        className="text-red-600"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINAÇÃO */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4 text-sm">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina((p) => p - 1)}
                className="p-2 border rounded disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <span>
                Página {pagina} de {totalPaginas}
              </span>

              <button
                disabled={pagina === totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
                className="p-2 border rounded disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL MAPA */}
      {mostrarMapa && pontoSelecionado && (
        <MapaModal
          ponto={pontoSelecionado}
          onClose={() => setMostrarMapa(false)}
        />
      )}

      {/* MODAL EDIÇÃO — mantido */}
      {editando && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setEditando(null)}
              className="absolute right-4 top-4 text-gray-600"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Editar {editando.cnpj}
            </h3>

            <div className="flex flex-col gap-3">
              <input
                className="border p-2 rounded"
                value={editando.logradouro}
                onChange={(e) =>
                  setEditando({ ...editando, logradouro: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                value={editando.numero}
                onChange={(e) =>
                  setEditando({ ...editando, numero: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                value={editando.bairro}
                onChange={(e) =>
                  setEditando({ ...editando, bairro: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                value={editando.cidade}
                onChange={(e) =>
                  setEditando({ ...editando, cidade: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                value={editando.uf}
                onChange={(e) =>
                  setEditando({ ...editando, uf: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                value={editando.cep}
                onChange={(e) =>
                  setEditando({ ...editando, cep: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border p-2 rounded"
                  value={editando.pdv_lat}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      pdv_lat: Number(e.target.value),
                    })
                  }
                />
                <input
                  className="border p-2 rounded"
                  value={editando.pdv_lon}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      pdv_lon: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditando(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={salvarEdicao}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

