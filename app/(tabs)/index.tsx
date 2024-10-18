// App.js

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useOAuth } from '@/hooks/useAuth';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import AppointmentList from '@/components/AppointmentList';
import FetchToken from '@/components/FetchToken';
import Login from '@/components/LogIn';
import useLocalAuth from '@/hooks/useLocalAuth';
import AppLocked from '@/components/AppLocked';

const App = () => {
  // Get loading state from OAuth hook
  const { loading } = useOAuth();
  const { isAuthenticated } = useLocalAuth();

  // Get authentication state from AuthManager store
  const { hasAccessToken, hasUserCredentials } = useAuthManagerStore();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <AppLocked />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      </View>
    );
  }

  if (hasUserCredentials) {
    return (
      <View style={styles.container}>
        {hasAccessToken ? <AppointmentList /> : <FetchToken />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
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
