import OAuthManager from '@/services/OAuthManager';
import { create } from 'zustand';

type AuthManagerStore = {
  manager: OAuthManager | null;
  setManager: (manager: OAuthManager) => void;
  hasAccessToken: boolean;
  setHasAccessToken: (hasAccessToken: boolean) => void;
  provider: any;
  setProvider: (provider: string) => void;
  hasUserCredentials: boolean;
  setHasUserCredentials: (hasUserCredentials: boolean) => void;
};

/**
 * Creates a Zustand store for managing authentication state.
 *
 * @returns {AuthManagerStore} The authentication manager store.
 *
 * @property {OAuthManager | null} manager - The OAuth manager instance.
 * @property {(manager: OAuthManager) => void} setManager - Sets the OAuth manager instance.
 * @property {boolean} hasAccessToken - Indicates if an access token is present.
 * @property {(hasAccessToken: boolean) => void} setHasAccessToken - Sets the access token presence state.
 * @property {any | null} provider - The authentication provider.
 * @property {(provider: any) => void} setProvider - Sets the authentication provider.
 * @property {boolean} hasUserCredentials - Indicates if user credentials are present.
 * @property {(hasUserCredentials: boolean) => void} setHasUserCredentials - Sets the user credentials state.
 *
 * @returns {AuthManagerStore} The authentication manager store.
 */
export const useAuthManagerStore = create<AuthManagerStore>((set) => ({
  manager: null,
  setManager: (manager: OAuthManager) => set({ manager }),
  hasAccessToken: false,
  setHasAccessToken: (hasAccessToken: boolean) => set({ hasAccessToken }),
  provider: null,
  setProvider: (provider: any) => set({ provider }),
  hasUserCredentials: false,
  setHasUserCredentials: (hasUserCredentials: boolean) =>
    set({ hasUserCredentials }),
}));
