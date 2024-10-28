import OAuthManager from '@/services/OAuthManager';
import { Provider } from '@/types/types';
import { AppState, AppStateStatus } from 'react-native';
import { create } from 'zustand';

type AuthManagerStore = {
  manager: OAuthManager | null;
  setManager: (manager: OAuthManager) => void;
  hasAccessToken: boolean;
  setHasAccessToken: (hasAccessToken: boolean) => void;
  provider: Provider | null;
  setProvider: (provider: Provider) => void;
  hasUserCredentials: boolean;
  setHasUserCredentials: (hasUserCredentials: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  appState: AppStateStatus;
  setAppState: (appState: AppStateStatus) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  routeToReturn: string;
  setRouteToReturn: (currentRoute: string) => void;
  patientName: string;
  setPatientName: (patientName: string) => void;
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
 * @property {Provider | null} provider - The authentication provider.
 * @property {(provider: Provider) => void} setProvider - Sets the authentication provider.
 * @property {boolean} hasUserCredentials - Indicates if user credentials are present.
 * @property {(hasUserCredentials: boolean) => void} setHasUserCredentials - Sets the user credentials state.
 * @property {boolean} isAuthenticated - Indicates if user has authenticated locally (biometrics).
 * @property {(isAuthenticated: boolean) => void} setIsAuthenticated - Sets the user has authenticated locally (biometrics) state.
 * @property {AppStateStatus} appState - Indicates the current state of app
 * @property {(appState: AppStateStatus) => void} setAppState - Sets the current state of app
 * @property {boolean} loading - Indicates if the app is loading (checking for access token and user credentials)
 * @property {(loading: boolean) => void} setLoading - Sets the loading state of app
 * @prpoerty {string} routeToReturn - The route to return to after authentication
 * @property {(currentRoute: string) => void} setRouteToReturn - Sets the route to return to after authentication
 * @property {string} patientName - The name of the patient
 * @property {(patientName: string) => void} setPatientName - Sets the name of the patient
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
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  appState: AppState.currentState,
  setAppState: (appState: AppStateStatus) => set({ appState }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  routeToReturn: '/home',
  setRouteToReturn: (route: string) => set({ routeToReturn: route }),
  patientName: '',
  setPatientName: (patientName: string) => set({ patientName }),
}));
