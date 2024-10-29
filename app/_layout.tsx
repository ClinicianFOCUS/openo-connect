import { useOAuth } from '@/hooks/useAuth';
import useLocalAuth from '@/hooks/useLocalAuth';
import { Stack } from 'expo-router';

/**
 * RootLayout component that defines the navigation stack for the application.
 *
 * @returns {JSX.Element} The stack navigator with defined screens.
 */
export default function RootLayout() {
  // Call useLocalAuth to init biometrics needed to unlock app at the start and when app state changes from background/inactive to foreground.
  useLocalAuth();

  // Call useOAuth to register callback listener and check if user is authenticated(o19 side) at first render
  useOAuth();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Main tab navigation screen */}
      <Stack.Screen name="(tabs)" options={{ headerTitle: 'Open-O-Connect' }} />

      {/* Patient detail screen with dynamic id */}
      <Stack.Screen
        name="patient-detail/[id]"
        options={{ headerTitle: 'Patient Detail' }}
      />

      <Stack.Screen name="callback" options={{ headerShown: false }} />
    </Stack>
  );
}
