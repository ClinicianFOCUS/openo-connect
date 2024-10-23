import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { Redirect } from 'expo-router';
import React from 'react';

// Empty callback component to handle the OAuth callback.
// Used so that OAuth redirect to /callback does not cause an error.
function Callback() {
  const { isAuthenticated, routeToReturn } = useAuthManagerStore();
  if (!isAuthenticated) return <Redirect href="/" />;
  return <Redirect href={routeToReturn ? (routeToReturn as any) : '/home'} />;
}

export default Callback;
