import OAuthManager from "@/services/OAuthManager";
import { create } from "zustand";

type AuthManagerStore = {
  manager: OAuthManager | null;
  setManager: (manager: OAuthManager) => void;
  hasAccessToken: boolean;
  setHasAccessToken: (hasAccessToken: boolean) => void;
};

export const useAuthManagerStore = create<AuthManagerStore>((set) => ({
  manager: null,
  setManager: (manager: OAuthManager) => set({ manager }),
  hasAccessToken: false,
  setHasAccessToken: (hasAccessToken: boolean) => set({ hasAccessToken }),
}));
