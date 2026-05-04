import { create } from "zustand";
import { fetchUsers } from "../services/userApi";

export type AppUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type UserState = {
  users: AppUser[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchUsers();
      set({ users: data, loading: false });
    } catch (_error) {
      set({ loading: false, error: "Failed to load users" });
    }
  }
}));
