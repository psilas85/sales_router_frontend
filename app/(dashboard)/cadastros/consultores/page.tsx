//sales_router_frontend/app/(dashboard)/cadastros/page.tsx

"use client";

import { useEffect, useState } from "react";
import {
  listarConsultores,
  deletarConsultor,
} from "@/services/consultores";
import Title from "@/components/Title";

export default function ConsultoresPage() {

  const [consultores, setConsultores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {

      const data = await listarConsultores();

      console.log("CONSULTORES:", data);

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

  return (
    <div className="p-8 space-y-6">

      <div>
        <Title>Consultores</Title>
        <p className="text-sm text-gray-500">
          Cadastro de consultores de campo
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        {loading && (
          <div className="p-6 text-sm text-gray-500">
            Carregando...
          </div>
        )}

        {!loading && consultores.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            Nenhum consultor cadastrado
          </div>
        )}

        {!loading && consultores.length > 0 && (

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">CPF</th>
              <th className="p-3 text-left">Setor</th>
              <th className="p-3 text-left">Cidade</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>

            {consultores.map((c) => (
              <tr key={c.id} className="border-t">

                <td className="p-3">{c.consultor}</td>
                <td className="p-3">{c.cpf}</td>
                <td className="p-3">{c.setor}</td>
                <td className="p-3">{c.cidade}</td>

                <td className="p-3 flex justify-center gap-3">

                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      window.location.href =
                        `/cadastros/consultores/${c.id}`
                    }
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