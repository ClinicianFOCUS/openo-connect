import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import AppointmentList from '@/components/AppointmentList';
import FetchToken from '@/components/FetchToken';
import Login from '@/components/LogIn';
import useCurrentRoute from '@/hooks/useCurrentRoute';
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import useModal from '@/hooks/useModal';
import CustomModal from '@/components/CustomModal';

const App = () => {
  // Get authentication state from AuthManager store
  const { hasAccessToken, hasUserCredentials, loading } = useAuthManagerStore();
  const { modalVisible, setModalVisible } = useModal();
  const navigation = useNavigation();

  // this sets the current route so that the app can return to it after authentication(biometrics)
  useCurrentRoute();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={showModal}>
            <Ionicons name="information-circle-outline" size={36} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const showModal = () => {
    setModalVisible(true);
  };

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
        <CustomModal
          title="Login Information"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        >
          <Text style={styles.title}>
            Important: Make sure to provide O19 base url in setting before
            logging in.
          </Text>
          <Text style={styles.paragraph}>
            Please enter your login credentials to access the application. If
            you don't have an account, please contact support for assistance.
          </Text>
          <Text style={styles.paragraph}>
            Your credentials are stored securely on your device and are not
            shared with anyone. Stored credentials are used for authentication
            purpose in the future.
          </Text>
        </CustomModal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  paragraph: {
    marginBottom: 10,
    color: '#666',
    lineHeight: 22,
  },
});

export default App;
