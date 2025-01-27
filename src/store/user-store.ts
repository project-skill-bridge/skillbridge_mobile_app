import { create } from "zustand";
import { User } from "../types/type";

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  removeUser: () => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
}));
