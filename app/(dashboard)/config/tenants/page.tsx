//sales_router_frontend/src/app/(dashboard)/config/tenants/page.tsx

"use client";

import { useEffect, useState } from "react";
import { listarTenants, criarTenant } from "@/services/auth-admin";
import { useAuthStore } from "@/store/useAuthStore";
import Title from "@/components/Title";

export default function TenantsPage() {
  const user = useAuthStore((s) => s.user);

  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    email_adm: "",
  });

  async function carregar() {
    setLoading(true);
    const data = await listarTenants();
    setTenants(data);
    setLoading(false);
  }

  async function criar() {
    if (
      !form.razao_social ||
      !form.nome_fantasia ||
      !form.cnpj ||
      !form.email_adm
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    await criarTenant(form);
    setForm({
      razao_social: "",
      nome_fantasia: "",
      cnpj: "",
      email_adm: "",
    });
    carregar();
  }

  useEffect(() => {
    if (!user) return;

    if (user.role !== "sales_router_adm") {
      window.location.href = "/home";
      return;
    }

    carregar();
  }, [user]);

  if (!user) {
    return (
      <div className="p-8">
        <Title>Tenants</Title>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Title>Tenants</Title>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Razão Social"
          value={form.razao_social}
          onChange={(e) =>
            setForm({ ...form, razao_social: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Nome Fantasia"
          value={form.nome_fantasia}
          onChange={(e) =>
            setForm({ ...form, nome_fantasia: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Email Admin"
          value={form.email_adm}
          onChange={(e) =>
            setForm({ ...form, email_adm: e.target.value })
          }
        />

        <button
          onClick={criar}
          className="bg-brand text-white rounded p-2 col-span-full"
        >
          Criar Tenant
        </button>
      </div>

      {/* TABELA */}
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Razão Social</th>
            <th className="p-3 text-left">CNPJ</th>
            <th className="p-3 text-center">Master</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-3">{t.id}</td>
              <td className="p-3">{t.razao_social}</td>
              <td className="p-3">{t.cnpj}</td>
              <td className="p-3 text-center">
                {t.is_master ? "✔" : "-"}
              </td>
            </tr>
          ))}

          {!loading && tenants.length === 0 && (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                Nenhum tenant cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {loading && <p className="mt-4">Carregando…</p>}
    </div>
  );
}
