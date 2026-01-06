//sales_router_frontend/src/app/(dashboard)/config/usuarios/page.tsx

"use client";

import { useEffect, useState } from "react";
import {
  listarUsuarios,
  criarUsuario,
  desativarUsuario,
  listarTenants,
  ativarUsuario,
  atualizarUsuario,
} from "@/services/auth-admin";
import { useAuthStore } from "@/store/useAuthStore";
import Title from "@/components/Title";

type UserRole = "tenant_adm" | "tenant_operacional";


export default function UsuariosPage() {
  const user = useAuthStore((s) => s.user);

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);

  const [form, setForm] = useState<{
    nome: string;
    email: string;
    senha: string;
    role: UserRole | "";
    tenant_id: number;
  }>({
    nome: "",
    email: "",
    senha: "",
    role: "",
    tenant_id: 0,
  });


  async function carregar() {
    setLoading(true);

    const users = await listarUsuarios();
    setUsuarios(users);

    if (user?.role === "sales_router_adm") {
      const t = await listarTenants();
      setTenants(t);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!user) return;

    if (user.role === "tenant_operacional") {
      window.location.href = "/home";
      return;
    }

    carregar();
  }, [user]);

  async function criar() {
    const { nome, email, senha, role, tenant_id } = form;

    if (!nome || !email || !senha || !role) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (user?.role === "sales_router_adm") {
      if (role !== "tenant_adm") {
        alert("Admin do sistema só pode criar Admin de Tenant.");
        return;
      }
      if (!tenant_id) {
        alert("Selecione um tenant.");
        return;
      }
    }

    if (user?.role === "tenant_adm") {
      if (role !== "tenant_operacional") {
        alert("Admin do tenant só pode criar usuário operacional.");
        return;
      }
    }

    const payload: {
      nome: string;
      email: string;
      senha: string;
      role: UserRole;
      tenant_id: number;
    } = {
      nome,
      email,
      senha,
      role,
      tenant_id,
    };

    await criarUsuario(payload);


    setForm({
      nome: "",
      email: "",
      senha: "",
      role: "",
      tenant_id: 0,
    });

    carregar();
  }

  async function desativar(id: number) {
    await desativarUsuario(id);
    carregar();
  }

  async function ativar(id: number) {
    await ativarUsuario(id);
    carregar();
  }

  if (!user) {
    return (
      <div className="p-8">
        <Title>Usuários</Title>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <div>
        <Title>Usuários</Title>
        <p className="text-sm text-gray-500">
          Gerencie usuários, permissões e status de acesso
        </p>
      </div>

      {/* FORM CRIAÇÃO */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-base font-semibold mb-4">Criar novo usuário</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-brand focus:border-brand"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-brand focus:border-brand"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-brand focus:border-brand"
            placeholder="Senha"
            type="password"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
          />

          <select
            className="border border-gray-300 rounded-md p-2 text-sm"
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value as UserRole,
              })
            }

          >
            <option value="">Selecione o perfil</option>
            {user.role === "sales_router_adm" && (
              <option value="tenant_adm">Admin do Tenant</option>
            )}
            {user.role === "tenant_adm" && (
              <option value="tenant_operacional">Operacional</option>
            )}
          </select>

          {user.role === "sales_router_adm" && (
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={form.tenant_id}
              onChange={(e) =>
                setForm({ ...form, tenant_id: Number(e.target.value) })
              }
            >
              <option value={0}>Selecione o Tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome_fantasia}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={criar}
            className="col-span-full bg-brand hover:bg-brand/90 transition text-white rounded-md p-2 font-medium"
          >
            Criar Usuário
          </button>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Perfil</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">

                <td className="p-3">{u.nome}</td>
                <td className="p-3">{u.email}</td>

                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === "tenant_adm"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.ativo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>

                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => setUsuarioEditando({ ...u })}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>

                  {u.ativo ? (
                    <button
                      onClick={() => desativar(u.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Desativar
                    </button>
                  ) : (
                    <button
                      onClick={() => ativar(u.id)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Ativar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-4 text-sm text-gray-500">Carregando…</div>
        )}
      </div>

      {/* MODAL EDIÇÃO */}
      {usuarioEditando && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Editar usuário</h2>
              <p className="text-sm text-gray-500">
                Atualize os dados do usuário
              </p>
            </div>

            <input
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              value={usuarioEditando.nome}
              onChange={(e) =>
                setUsuarioEditando({
                  ...usuarioEditando,
                  nome: e.target.value,
                })
              }
            />

            <input
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              value={usuarioEditando.email}
              onChange={(e) =>
                setUsuarioEditando({
                  ...usuarioEditando,
                  email: e.target.value,
                })
              }
            />

            <input
              className="border border-gray-300 rounded-md p-2 w-full text-sm bg-gray-100"
              value={usuarioEditando.role}
              disabled
            />

            <input
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              type="password"
              placeholder="Nova senha (opcional)"
              value={usuarioEditando.senha || ""}
              onChange={(e) =>
                setUsuarioEditando({
                  ...usuarioEditando,
                  senha: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setUsuarioEditando(null)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>

              <button
                className="bg-brand hover:bg-brand/90 transition text-white px-4 py-2 rounded-md text-sm font-medium"
                onClick={async () => {
                  const { nome, email, senha } = usuarioEditando;

                  if (!nome || !email) {
                    alert("Nome e email são obrigatórios");
                    return;
                  }

                  await atualizarUsuario(usuarioEditando.id, {
                    nome,
                    email,
                    role: usuarioEditando.role,
                    senha: senha?.trim() ? senha : undefined,
                  });

                  setUsuarioEditando(null);
                  carregar();
                }}
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
