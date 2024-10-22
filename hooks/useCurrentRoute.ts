import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { useFocusEffect } from '@react-navigation/native';
import { usePathname } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook that captures the current route and sets it in the authentication manager store. This is used to determine the route to return to after authentication.
 *
 * This hook uses the `usePathname` hook to get the current route and the `useAuthManagerStore`
 * to get the `setRouteToReturn` function. It also uses `useFocusEffect` to ensure that the
 * route is set whenever the component gains focus.
 *
 * @returns {void}
 */
const useCurrentRoute = () => {
  const route = usePathname();
  const { setRouteToReturn } = useAuthManagerStore();
  useFocusEffect(
    useCallback(() => {
      console.log('useCurrentRoute', route);
      setRouteToReturn(route);
    }, [])
  );
};

export default useCurrentRoute;
