import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authenticateUser } from '@/utils/localAuth';
import { StatusType } from '@/types/types';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';

/**
 * AppLocked component renders a screen indicating that the application is locked.
 * It provides an option to unlock the application by calling the `authenticateUser` function.
 *
 * @returns {JSX.Element} The rendered component.
 */
const AppLocked = () => {
  const { setIsAuthenticated } = useAuthManagerStore();

  // Function to authenticate user on button press
  const onPress = () => {
    authenticateUser().then((res) => {
      if (res.status == StatusType.SUCCESS) {
        setIsAuthenticated(true);
      }
    });
  };
  return (
    <SafeAreaView>
      <View
        style={{
          height: '90%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Ionicons name="lock-closed-outline" size={69} />
          <Text style={{ fontSize: 24, marginTop: 10 }}>
            Open-O-Connect Locked
          </Text>
        </View>
        <Button title="Unlock" onPress={onPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default AppLocked;
