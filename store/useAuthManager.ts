import OAuthManager from "@/services/OAuthManager";
import { create } from "zustand";

type AuthManager = {
  manager: OAuthManager | null;
  setManager: (manager: OAuthManager) => void;
};

export const useAuthManager = create<AuthManager>((set) => ({
  manager: null,
  setManager: (manager: OAuthManager) => set({ manager }),
}));
