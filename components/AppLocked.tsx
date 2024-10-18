import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import useLocalAuth from '@/hooks/useLocalAuth';

/**
 * AppLocked component renders a screen indicating that the application is locked.
 * It provides an option to unlock the application by calling the `authenticateUser` function.
 *
 * @returns {JSX.Element} The rendered component.
 */
const AppLocked = () => {
  const { authenticateUser } = useLocalAuth();
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
        <Button title="Unlock" onPress={authenticateUser} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default AppLocked;
