//sales_router_frontend/app/(dashboard)/cadastros/page.tsx

// sales_router_frontend/app/(dashboard)/cadastros/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listarConsultores,
  deletarConsultor,
} from "@/services/consultores";

import Title from "@/components/Title";

function formatCPF(cpf: string) {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export default function ConsultoresPage() {

  const router = useRouter();

  const [consultores, setConsultores] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregar() {

    try {

      const data = await listarConsultores();

      setConsultores(data);

    } catch (err) {
      console.error("Erro ao carregar consultores", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function excluir(id: string) {

    if (!confirm("Deseja excluir este consultor?")) return;

    await deletarConsultor(id);

    carregar();
  }

  const filtrados = consultores.filter((c) =>
    c.consultor?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <Title>Consultores</Title>

          <p className="text-sm text-gray-500">
            Cadastro de consultores de campo
          </p>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          onClick={() =>
            window.location.href = "/cadastros/consultores/novo"
          }
        >
          Novo consultor
        </button>

      </div>

      <div className="flex">

        <input
          type="text"
          placeholder="Buscar consultor..."
          className="border rounded-lg px-3 py-2 text-sm w-80"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        {loading && (
          <div className="p-6 text-sm text-gray-500">
            Carregando...
          </div>
        )}

        {!loading && filtrados.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            Nenhum consultor encontrado
          </div>
        )}

        {!loading && filtrados.length > 0 && (

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">

            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">CPF</th>
              <th className="p-3 text-left">Setor</th>
              <th className="p-3 text-left">Bairro</th>
              <th className="p-3 text-left">Cidade</th>
              <th className="p-3 text-left">UF</th>
              <th className="p-3 text-center">Ações</th>
            </tr>

          </thead>

          <tbody>

            {filtrados.map((c) => (

              <tr key={c.id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-medium">
                  {c.consultor}
                </td>

                <td className="p-3">
                  {formatCPF(c.cpf)}
                </td>

                <td className="p-3">
                  {c.setor}
                </td>

                <td className="p-3">
                  {c.bairro}
                </td>

                <td className="p-3">
                  {c.cidade}
                </td>

                <td className="p-3">
                  {c.uf}
                </td>

                <td className="p-3 flex justify-center gap-3">

                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => router.push(`/cadastros/consultores/${c.id}`)}
                  >
                    Editar
                  </button>

                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => excluir(c.id)}
                  >
                    Excluir
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        )}

      </div>

    </div>
  );
}