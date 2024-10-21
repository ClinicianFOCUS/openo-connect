// App.js

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useOAuth } from '@/hooks/useAuth';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import AppointmentList from '@/components/AppointmentList';
import FetchToken from '@/components/FetchToken';
import Login from '@/components/LogIn';

const App = () => {
  // Get loading state from OAuth hook
  const { loading } = useOAuth();

  // Get authentication state from AuthManager store
  const { hasAccessToken, hasUserCredentials } = useAuthManagerStore();

  return (
    <View style={styles.container}>
      {loading ? (
        // Show loading indicator while authentication is in progress
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : hasUserCredentials ? (
        // If user credentials are available
        hasAccessToken ? (
          // If access token is available, show appointment list
          <AppointmentList />
        ) : (
          // If access token is not available, fetch token
          <FetchToken />
        )
      ) : (
        // If user credentials are not available, show login screen
        <Login />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
});

export default App;
