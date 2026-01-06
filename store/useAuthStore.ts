//sales_router_frontend/store/useAuthStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import { login as apiLogin, getMe } from "../services/auth";

interface AuthState {
  token: string | null;
  user: {
    email: string;
    role: string;
    tenant_id: number;
  } | null;
  loading: boolean;
  error: string | null;

  login: (email: string, senha: string) => Promise<boolean>;
  loadUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: true, // 👈 começa true
      error: null,

      // ======================
      // LOGIN
      // ======================
      login: async (email, senha) => {
        set({ loading: true, error: null });

        try {
          const token = await apiLogin(email, senha);

          localStorage.setItem("token", token);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ token });

          const res = await getMe();
          set({ user: res.user, loading: false });

          return true;
        } catch {
          set({ error: "Credenciais inválidas", loading: false });
          return false;
        }
      },

      // ======================
      // LOAD USER (BOOT / REFRESH)
      // ======================
      loadUser: async () => {
        set({ loading: true });

        const token = localStorage.getItem("token");
        if (!token) {
          set({ loading: false });
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        set({ token });

        try {
          const res = await getMe();
          set({ user: res.user, loading: false });
        } catch {
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
          set({ token: null, user: null, loading: false });
        }
      },

      // ======================
      // LOGOUT
      // ======================
      logout: () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        set({ token: null, user: null, loading: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({
        token: s.token,
        user: s.user,
      }),
    }
  )
);
