import React, { useEffect } from 'react';
import AppLocked from '@/components/AppLocked';
import { useRouter } from 'expo-router';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';

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
  const { isAuthenticated } = useAuthManagerStore();
  const router = useRouter();

  //Redirect user to home screen if locally authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  return <AppLocked />;
};

export default App;
