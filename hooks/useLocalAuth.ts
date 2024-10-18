import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const useLocalAuth = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    // Listener for app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // When app transitions from background to active (foreground)
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        authenticateUser(); // Trigger authentication
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

  // Function to authenticate the user
  const authenticateUser = async () => {
    // Check if the device has the necessary hardware for local authentication
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return; // Exit if no hardware is available

    // Check if the user has enrolled in local authentication (e.g., fingerprint, face recognition)
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return; // Exit if no enrollment is found

    // Prompt the user to authenticate
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access the app',
    });

    // Handle the authentication result
    if (!result.success) {
      console.log('Authentication failed');
      // Optionally, navigate to a login screen or exit the app
    } else {
      setIsAuthenticated(true); // Set the authentication state to true if successful
    }
  };

  return { authenticateUser, isAuthenticated };
};

export default useLocalAuth;
