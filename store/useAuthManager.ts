import OAuthManager from "@/services/OAuthManager";
import { create } from "zustand";

type AuthManager = {
  manager: OAuthManager | null;
  setManager: (manager: OAuthManager) => void;
  hasAccessToken: boolean;
  setHasAccessToken: (hasAccessToken: boolean) => void;
};

export const useAuthManager = create<AuthManager>((set) => ({
  manager: null,
  setManager: (manager: OAuthManager) => set({ manager }),
  hasAccessToken: false,
  setHasAccessToken: (hasAccessToken: boolean) => set({ hasAccessToken }),
}));
