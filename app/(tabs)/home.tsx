import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import AppointmentList from '@/components/AppointmentList';
import FetchToken from '@/components/FetchToken';
import Login from '@/components/LogIn';
import useCurrentRoute from '@/hooks/useCurrentRoute';
import { useFocusEffect, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import useModal from '@/hooks/useModal';
import CustomModal from '@/components/CustomModal';
import LoginInfo from '@/components/info/loginInfo';
import HomeInfo from '@/components/info/homeInfo';

const App = () => {
  // Get authentication state from AuthManager store
  const { hasAccessToken, hasUserCredentials, loading } = useAuthManagerStore();
  const { modalVisible, setModalVisible, navigation } = useModal();

  // this sets the current route so that the app can return to it after authentication(biometrics)
  useCurrentRoute();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerRight: () => (
          <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="information-circle-outline" size={36} />
            </TouchableOpacity>
          </View>
        ),
      });
    }, [])
  );

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
          <LoginInfo />
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
      <CustomModal
        title="Information"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <HomeInfo />
      </CustomModal>
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
});

export default App;
