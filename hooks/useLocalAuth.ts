import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { authenticateUser } from '@/utils/localAuth';
import { StatusType } from '@/types/types';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { useRouter } from 'expo-router';

const useLocalAuth = () => {
  const { setIsAuthenticated, appState, setAppState } = useAuthManagerStore();
  const router = useRouter();

  // Trigger auth when user opens app.
  useEffect(() => {
    triggerAuthentication();
  }, []);

  const triggerAuthentication = () => {
    authenticateUser().then((res) => {
      if (res.status == StatusType.SUCCESS) {
        setIsAuthenticated(true);
      }
    });
  };

  useEffect(() => {
    // Listener for app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      //redirect user to app locked screen when nextAppState is inactive or background. setting this here to remove delay when showing locked screen
      if (nextAppState.match(/inactive|background/)) {
        setIsAuthenticated(false);
        router.replace('/');
      }

      // When app transitions from background to active (foreground), trigger authentication
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // Trigger authentication
        triggerAuthentication();
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
