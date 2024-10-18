import { Stack } from 'expo-router';

/**
 * RootLayout component that defines the navigation stack for the application.
 *
 * @returns {JSX.Element} The stack navigator with defined screens.
 */
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Main tab navigation screen */}
      <Stack.Screen name="(tabs)" options={{ headerTitle: 'Open-O-Connect' }} />

      {/* Patient detail screen with dynamic id */}
      <Stack.Screen name="patient-detail/[id]" />
    </Stack>
  );
}
