//sales_router_frontend/app/%28dashboard%29/dados/locais/page.tsx

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

import {
  FileSpreadsheet,
  Map,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const MapaModal = dynamic(() => import("./pdv-mapa-modal"), { ssr: false });

export default function DadosLocaisPage() {
  // filtros
  const [inputId, setInputId] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");

  // dados
  const [lista, setLista] = useState<PDVLocal[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // edição
  const [editando, setEditando] = useState<PDVLocal | null>(null);

  // mapa
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [pontoSelecionado, setPontoSelecionado] = useState<PDVLocal | null>(null);

  // paginação
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const filtrosValidos =
    inputId && uf && (cidade || cnpj || logradouro || bairro || cep);

  // Buscar PDVs
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
      setLista(res.pdvs);
    } catch {
      setErro("Erro ao buscar locais.");
    } finally {
      setCarregando(false);
    }
  }

  // Salvar edição
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
      alert("Salvo com sucesso!");

      setLista((old) => old.map((p) => (p.id === editando.id ? editando : p)));
      setEditando(null);
    } catch {
      alert("Erro ao salvar.");
    }
  }

  async function excluir(id: number) {
    if (!confirm("Tem certeza que deseja excluir este PDV?")) return;

    try {
      await excluirLocal(id);
      alert("PDV excluído!");

      setLista((old) => old.filter((p) => p.id !== id));
    } catch {
      alert("Erro ao excluir.");
    }
  }

  const totalPaginas = Math.ceil(lista.length / porPagina);
  const exibidos = lista.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-12">

      {/* TÍTULO */}
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="text-brand-primary h-9 w-9" />
        <h1 className="text-3xl font-semibold text-neutral-text">
          Dados → Locais
        </h1>
      </div>

      {/* FILTROS */}
      <div className="bg-neutral-card border border-neutral-border rounded-2xl shadow-card p-10 space-y-6">
        <h2 className="text-xl font-semibold text-neutral-text">Filtros</h2>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            placeholder="Input ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="input-modern"
          />

          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="input-modern"
          >
            <option value="">UF</option>
            {[
              "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
              "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
            ].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          <input placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className="input-modern" />
          <input placeholder="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="input-modern" />
          <input placeholder="Logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className="input-modern" />
          <input placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="input-modern" />
          <input placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} className="input-modern" />
        </div>

        <button
          onClick={buscar}
          disabled={!filtrosValidos}
          className={`btn-primary ${!filtrosValidos && "opacity-40 cursor-not-allowed"}`}
        >
          Buscar
        </button>

        {erro && <p className="text-red-600">{erro}</p>}
      </div>

      {/* RESULTADOS */}
      {lista.length > 0 && (
        <div className="bg-neutral-card border border-neutral-border rounded-2xl shadow-card p-10 space-y-6">
          <h2 className="text-xl font-semibold text-neutral-text">
            Resultados ({lista.length})
          </h2>

          <table className="w-full text-sm border border-neutral-border rounded-xl overflow-hidden">
            <thead className="bg-neutral-bg text-neutral-text border-b border-neutral-border">
              <tr>
                <th className="p-3 text-left">CNPJ</th>
                <th className="p-3 text-left">Endereço</th>
                <th className="p-3 text-center">Lat</th>
                <th className="p-3 text-center">Lon</th>
                <th className="p-3 text-center">Mapa</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {exibidos.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`
                    border-b border-neutral-border
                    ${idx % 2 === 0 ? "bg-white" : "bg-neutral-bg"}
                    hover:bg-brand-soft/40
                  `}
                >
                  <td className="p-3">{p.cnpj}</td>
                  <td className="p-3">{p.endereco_completo}</td>
                  <td className="p-3 text-center">{p.pdv_lat}</td>
                  <td className="p-3 text-center">{p.pdv_lon}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setPontoSelecionado(p);
                        setMostrarMapa(true);
                      }}
                      className="icon-button"
                    >
                      <Map className="text-brand-primary" />
                    </button>
                  </td>

                  <td className="p-3 text-center flex justify-center gap-3">

                    <button
                      onClick={() => setEditando(p)}
                      className="btn-table-primary"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluir(p.id)}
                      className="btn-delete"
                      title="Excluir"
                    >
                      🗑️
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINAÇÃO */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">

              <button
                disabled={pagina === 1}
                onClick={() => setPagina((p) => p - 1)}
                className="btn-page"
              >
                <ChevronLeft />
              </button>

              <span className="font-medium">
                Página {pagina} de {totalPaginas}
              </span>

              <button
                disabled={pagina === totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
                className="btn-page"
              >
                <ChevronRight />
              </button>

            </div>
          )}
        </div>
      )}

      {/* MODAL MAPA */}
      {mostrarMapa && pontoSelecionado && (
        <MapaModal
          ponto={pontoSelecionado}
          onClose={() => setMostrarMapa(false)}
        />
      )}

      {/* MODAL EDIÇÃO */}
      {editando && (
        <div className="modal-bg">
          <div className="modal-card">

            <button
              onClick={() => setEditando(null)}
              className="modal-close"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold text-neutral-text mb-4">
              Editar {editando.cnpj}
            </h2>

            <div className="flex flex-col gap-3">
              <input className="input-modern" value={editando.logradouro} onChange={(e) => setEditando({ ...editando, logradouro: e.target.value })} />
              <input className="input-modern" value={editando.numero} onChange={(e) => setEditando({ ...editando, numero: e.target.value })} />
              <input className="input-modern" value={editando.bairro} onChange={(e) => setEditando({ ...editando, bairro: e.target.value })} />
              <input className="input-modern" value={editando.cidade} onChange={(e) => setEditando({ ...editando, cidade: e.target.value })} />
              <input className="input-modern" value={editando.uf} onChange={(e) => setEditando({ ...editando, uf: e.target.value })} />
              <input className="input-modern" value={editando.cep} onChange={(e) => setEditando({ ...editando, cep: e.target.value })} />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <input className="input-modern" value={editando.pdv_lat} onChange={(e) => setEditando({ ...editando, pdv_lat: Number(e.target.value) })} />
                <input className="input-modern" value={editando.pdv_lon} onChange={(e) => setEditando({ ...editando, pdv_lon: Number(e.target.value) })} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditando(null)} className="btn-neutral">
                Cancelar
              </button>

              <button onClick={salvarEdicao} className="btn-primary">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* -----------------------
   ESTILOS UTILITÁRIOS
----------------------- */

const styles = `
.input-modern {
  @apply border border-neutral-border bg-neutral-bg p-3 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition;
}
.btn-primary {
  @apply bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg shadow-card transition;
}
.btn-neutral {
  @apply px-4 py-2 bg-neutral-border text-neutral-text rounded hover:bg-neutral-40;
}
.btn-table-primary {
  @apply text-brand-primary border border-brand-primary rounded px-3 py-1 hover:bg-brand-soft;
}
.btn-delete {
  @apply text-red-600 hover:text-red-800;
}
.btn-page {
  @apply p-2 border border-neutral-border rounded hover:bg-neutral-bg disabled:opacity-40;
}
.icon-button {
  @apply p-2 rounded hover:bg-neutral-bg transition;
}
.modal-bg {
  @apply fixed inset-0 bg-black/40 flex items-center justify-center;
}
.modal-card {
  @apply bg-white p-8 rounded-xl w-full max-w-lg relative shadow-card;
}
.modal-close {
  @apply absolute right-4 top-4 text-neutral-text hover:text-black;
}
`;
