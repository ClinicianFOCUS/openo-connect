import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useOAuth } from '@/hooks/useAuth';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import AppointmentList from '@/components/AppointmentList';
import FetchToken from '@/components/FetchToken';
import Login from '@/components/LogIn';

const App = () => {
  // Get authentication state from AuthManager store
  const { hasAccessToken, hasUserCredentials, loading } = useAuthManagerStore();

  // Show loading indicator while checking authentication state and oauth manager has been initialized
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      </View>
    );
  }

  // Show if user credentials are not provided
  if (!hasUserCredentials) {
    return (
      <View style={styles.container}>
        <Login />
      </View>
    );
  }

  // Show if user credentials are provided but access token in not present
  if (!hasAccessToken) {
    return (
      <View style={styles.container}>
        <FetchToken />
      </View>
    );
  }

  // Show appointment list
  return (
    <View style={styles.container}>
      <AppointmentList />
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
