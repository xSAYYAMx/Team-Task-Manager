import { create } from "zustand";

type User = { id: string; name: string; email: string; role: string };

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
};

const storedUser = localStorage.getItem("auth_user");
const storedToken = localStorage.getItem("auth_token");

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken || null,
  setAuth: (user, token) => {
    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("auth_token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    set({ user: null, token: null });
  }
}));
