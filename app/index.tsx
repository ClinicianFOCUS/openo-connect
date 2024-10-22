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
  const { isAuthenticated, routeToReturn } = useAuthManagerStore();
  const router = useRouter();

  //Redirect user to home screen if locally authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (!routeToReturn) {
        router.replace('/home');
      } else {
        router.replace(routeToReturn as any);
      }
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <AppLocked />;

  return;
};

export default App;
