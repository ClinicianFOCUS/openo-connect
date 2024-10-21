import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { authenticateUser } from '@/utils/localAuth';
import { StatusType } from '@/types/types';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { useRouter } from 'expo-router';

const useLocalAuth = () => {
  const { setIsAuthenticated, appState, setAppState } = useAuthManagerStore();
  const router = useRouter();

  useEffect(() => {
    authenticateUser().then((res) => {
      if (res.status == StatusType.SUCCESS) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  useEffect(() => {
    // Listener for app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // When app transitions from background to active (foreground) redirect user to app locked screen
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        setIsAuthenticated(false);
        router.replace('/');
        // Trigger authentication
        authenticateUser().then((res) => {
          if (res.status == StatusType.SUCCESS) {
            setIsAuthenticated(true);
          }
        });
      }

      setAppState(nextAppState); // Update the appState
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Clean up the event listener on unmount
    return () => {
      subscription.remove();
    };
  }, [appState]);
};

export default useLocalAuth;
