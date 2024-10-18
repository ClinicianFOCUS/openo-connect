import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const useLocalAuth = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    console.log('app state changed');
  }, [appState]);

  const authenticateUser = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    console.log(hasHardware);
    if (!hasHardware) return;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    console.log(isEnrolled);
    if (!isEnrolled) return;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access the app',
    });

    if (!result.success) {
      console.log('Authentication failed');
      // Optionally, navigate to a login screen or exit the app
    } else {
      setIsAuthenticated(true);
    }
  };

  return { authenticateUser, isAuthenticated };
};

export default useLocalAuth;
