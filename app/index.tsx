import React, { useEffect } from 'react';
import AppLocked from '@/components/AppLocked';
import useLocalAuth from '@/hooks/useLocalAuth';
import { useRouter } from 'expo-router';

/**
 * The main application component.
 *
 * This component checks if the user is authenticated using the `useLocalAuth` hook.
 * If the user is authenticated, it redirects them to the '/(tabs)' route using the `useRouter` hook.
 *
 * @component
 * @returns {JSX.Element} The locked state of the application.
 */
const App = () => {
  const { isAuthenticated } = useLocalAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  return <AppLocked />;
};

export default App;
