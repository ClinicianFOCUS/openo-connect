// App.js

import React from 'react';
import { View, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useOAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import AppointmentList from '@/components/AppointmentList';

const App = () => {
  const { loading } = useOAuth();
  const { hasAccessToken, hasUserCredentials } = useAuthManagerStore();
  const router = useRouter();
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : hasUserCredentials ? (
        hasAccessToken ? (
          <AppointmentList />
        ) : (
          <Button
            title="Fetch Access Token"
            onPress={() => router.push('/o19-login')}
          />
        )
      ) : (
        <Button
          title="Login with O19"
          onPress={() => router.push('/o19-login')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
