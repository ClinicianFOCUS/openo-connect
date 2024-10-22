import { useEffect, useState } from 'react';
import { Alert, EmitterSubscription, Linking } from 'react-native';
import OAuthManager from '@/services/OAuthManager';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import { CustomKeyType, CustomResponse, StatusType } from '@/types/types';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { Method } from 'axios';
import { CALLBACK_URL } from '@/constants/constant';

/**
 * Custom hook to manage OAuth authentication.
 *
 * @returns {Object} - An object containing the `callApi` function and `loading` state.
 *
 * @example
 * const { callApi, loading } = useOAuth();
 *
 * @function
 * @name useOAuth
 *
 * @description
 * This hook initializes the OAuth manager, handles OAuth callbacks, and provides a method to make authorized API requests.
 * It also manages the loading state during the initialization and authentication process.
 *
 *
 */
export const useOAuth = () => {
  const {
    manager,
    setManager,
    setHasAccessToken,
    setProvider,
    setHasUserCredentials,
    setLoading,
  } = useAuthManagerStore();

  useEffect(() => {
    // Add an event listener for OAuth callback URLs to get the access token
    let callbackListener: EmitterSubscription;
    if (manager) {
      callbackListener = Linking.addEventListener('url', (event) =>
        handleUrl(event, manager)
      );
    }

    // Clean up the event listener when the component unmounts or the manager changes
    return () => {
      callbackListener?.remove();
    };
  }, [manager]);

  useEffect(() => {
    setLoading(true);

    // Check if user credentials are stored in SecureKeyStore
    const hasCreds =
      SecureKeyStore.getKey(CustomKeyType.USERNAME) &&
      SecureKeyStore.getKey(CustomKeyType.PASSWORD) &&
      SecureKeyStore.getKey(CustomKeyType.PIN);
    if (hasCreds) {
      setHasUserCredentials(true);
    }

    // Check if access token and secret key are stored in SecureKeyStore
    if (
      SecureKeyStore.getKey(CustomKeyType.ACCESS_TOKEN) &&
      SecureKeyStore.getKey(CustomKeyType.SECRET_KEY)
    ) {
      setHasAccessToken(true);
      getProviderNo();
    }

    // Initialize the OAuthManager if it is not already initialized and there are stored credentials
    if (!manager && hasCreds) {
      initManager();
    }

    setLoading(false);
  }, []);

  /**
   * Initializes the OAuthManager instance and sets it to the state.
   * If an error occurs during the creation of the OAuthManager, it logs the error to the console.
   *
   * @async
   * @function initManager
   * @returns {Promise<void>} A promise that resolves when the OAuthManager is successfully initialized.i
   */
  const initManager = async () => {
    try {
      console.log('Setting up new manager');
      setManager(new OAuthManager());
    } catch (error) {
      console.log('Error creating OAuthManager', error);
    }
  };

  /**
   * Handles the URL event to exchange the request token for an access token.
   *
   * @param event - The event object containing the URL.
   * @param manager - The OAuthManager instance used to manage OAuth operations.
   *
   * This function checks if the URL starts with the base experience URL. If it does,
   * it extracts the `oauth_verifier` from the URL parameters and uses it to request
   * an access token from the OAuthManager. Depending on the response status, it either
   * sets the access token state and shows a success alert or shows an error alert.
   */
  const handleUrl = async (event: { url: string }, manager: OAuthManager) => {
    setLoading(true);
    const { url } = event;
    if (url.startsWith(CALLBACK_URL)) {
      const params = new URLSearchParams(url.split('?')[1]);
      const oauth_verifier = params.get('oauth_verifier') || '';

      // Step 5: Exchange the request token for an access token
      const res = await manager.getAccessToken(oauth_verifier);

      if (res.status == StatusType.SUCCESS) {
        setHasAccessToken(true);
        setHasUserCredentials(true);
        setLoading(false);
      } else {
        Alert.alert('Error', 'Failed to get access token');
      }
    }
  };

  /**
   * Makes an authorized API request using the specified HTTP method and URL.
   * If the OAuthManager is not initialized, it returns an error response.
   *
   * @param method - The HTTP method to use for the request (e.g., GET, POST).
   * @param url - The URL to which the request is made.
   * @returns A promise that resolves to a `CustomResponse` object containing the status and message.
   */
  const callApi = async (
    method: Method,
    url: string
  ): Promise<CustomResponse> => {
    if (manager) {
      return await manager.makeAuthorizedRequest(method, url);
    }
    return {
      status: StatusType.ERROR,
      message: 'OAuthManager not initialized',
    };
  };

  /**
   * Fetches the provider number and updates the provider state.
   *
   * @async
   * @function
   * @name getProviderNo
   *
   * @description
   * This function makes an authorized API request to fetch the provider number.
   * If the request is successful, it updates the provider state with the fetched data.
   *
   * @returns {Promise<void>}
   */
  const getProviderNo = async () => {
    const res = await callApi('GET', 'providerService/provider/me');
    if (res && res.status === StatusType.SUCCESS) {
      setProvider(res.data);
    }
  };
};
