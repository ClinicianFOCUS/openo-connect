import { CustomKeyType } from '@/types/types';
import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import O19WebView from './O19_WebView';

/**
 * O19Login component handles the OAuth login flow using a WebView.
 * It initiates the OAuth flow, injects jQuery into the WebView, and manages loading states.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const Login = () => {
  const [loginText, setLoginText] = useState<string>('Login');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  /**
   * Handles the login process by performing the following steps:
   * 1. Saves the username, password, and PIN to the secure key store.
   * 2. Updates the login text to indicate the login process has started which renders the O19WebView component.
   * @returns {void}
   */
  const handleLogin = () => {
    SecureKeyStore.saveKey(CustomKeyType.USERNAME, username);
    SecureKeyStore.saveKey(CustomKeyType.PASSWORD, password);
    SecureKeyStore.saveKey(CustomKeyType.PIN, pin);
    setLoginText('Logging in...');
    setLoginError('');
  };

  return (
    <View style={styles.center}>
      <View style={styles.container}>
        {/* Username input field */}
        <Text style={styles.inputLabel}>Username:</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter Username"
          style={styles.input}
        />

        {/* Password input field */}
        <Text style={styles.inputLabel}>Password:</Text>
        <TextInput
          value={password}
          textContentType="password"
          onChangeText={setPassword}
          placeholder="Enter Password"
          style={styles.input}
          secureTextEntry={true}
        />

        {/* PIN input field */}
        <Text style={styles.inputLabel}>Pin:</Text>
        <TextInput
          value={pin}
          textContentType="password"
          onChangeText={setPin}
          placeholder="Enter Pin"
          style={styles.input}
          secureTextEntry={true}
        />

        {/* Display login error message if any */}
        {loginError.length > 0 && (
          <Text style={styles.errorMessage}>{loginError}</Text>
        )}

        {/* Login button */}
        <Button
          title={loginText}
          onPress={handleLogin}
          disabled={loginText !== 'Login'}
        />

        {/* Render O19WebView component if login process has started */}
        {loginText !== 'Login' && (
          <O19WebView
            initialButtonText="Login"
            setError={setLoginError}
            setButtonText={setLoginText}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '85%',
    display: 'flex',
    gap: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
});

export default Login;
