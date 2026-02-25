// sales_router_frontend/components/processamento/entrada-de-dados/InputsTab.tsx

"use client";

import { useEffect, useState } from "react";
import { listarInputs, excluirInput } from "@/services/pdv";
import Button from "@/components/ui/Button";

export default function InputsTab() {
  const [inputs, setInputs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    const res = await listarInputs();
    setInputs(res.jobs || []);
    setLoading(false);
  }

  async function handleExcluir(input_id: string) {
    if (!confirm("Deseja realmente excluir este processamento?")) return;

    try {
      await excluirInput(input_id);
      alert("Processamento excluído com sucesso.");
      carregar();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erro ao excluir.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="space-y-4">
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Data</th>
            <th className="p-2 text-left">Descrição</th>
            <th className="p-2 text-left">Input ID</th>
            <th className="p-2 text-center">PDVs</th>
            <th className="p-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((item) => (
            <tr key={item.input_id} className="border-t">
              <td className="p-2">
                {new Date(item.criado_em).toLocaleString()}
              </td>
              <td className="p-2">{item.descricao}</td>
              <td className="p-2 font-mono text-xs">
                {item.input_id}
              </td>
              <td className="p-2 text-center">
                {item.total_processados || 0}
              </td>
              <td className="p-2 text-center">
                <Button
                  variant="danger"
                  onClick={() => handleExcluir(item.input_id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}