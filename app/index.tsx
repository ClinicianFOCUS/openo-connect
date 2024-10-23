import React, { useEffect, useState } from 'react';
import AppLocked from '@/components/AppLocked';
import { Redirect } from 'expo-router';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import { CustomKeyType } from '@/types/types';
import TermsAndConditions from './termsAndCondition';

/**
 * The main application component.
 *
 * This component checks if the user is authenticated using the `useAuthManagerStore` hook.
 * If the user is not authenticated, it renders the `AppLocked` component.
 * If the user has not accepted the terms and conditions, it renders the `TermsAndConditions` component.
 * If the user is authenticated and has accepted the terms, it redirects them to the appropriate route.
 *
 * @component
 * @returns {JSX.Element} The locked state of the application, terms and conditions, or a redirect.
 */
const App = () => {
  const { isAuthenticated, routeToReturn } = useAuthManagerStore();

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);

  // Check if the user has accepted the terms and conditions
  useEffect(() => {
    const accepted = SecureKeyStore.getKey(CustomKeyType.HAS_ACCEPTED_TERMS);
    setHasAcceptedTerms(accepted === 'true');
  }, []);

  // If the user is not authenticated, show the AppLocked component
  if (!isAuthenticated) return <AppLocked />;

  // If the user has not accepted the terms and conditions, show the TermsAndConditions component
  if (!hasAcceptedTerms)
    return <TermsAndConditions setHasAcceptedTerms={setHasAcceptedTerms} />;

  return <Redirect href={routeToReturn ? (routeToReturn as any) : '/home'} />;
};

export default App;
