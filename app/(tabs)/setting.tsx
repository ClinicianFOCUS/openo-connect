import OAuthManager from '@/services/OAuthManager';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { CustomKeyType } from '@/types/types';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';

const SettingPage = () => {
  const { setManager, setHasAccessToken } = useAuthManagerStore();
  const [o19BaseUrl, setO19BaseUrl] = useState(
    SecureKeyStore.getKey(CustomKeyType.O19_BASE_URL) || ''
  );

  /**
   * Handles the save action for the settings.
   *
   * This function performs the following actions:
   * 1. Saves the client key, client secret, and base URL to the secure key store.
   * 2. Initializes a new OAuth manager.
   * 3. Deletes the access token and secret key from the secure key store.
   * 4. Updates the state to indicate that there is no access token.
   * 5. Dismisses the keyboard.
   * 6. Displays an alert indicating that the settings were saved successfully.
   */
  const handleSave = () => {
    // Save the base URL to the secure key store
    SecureKeyStore.saveKey(CustomKeyType.O19_BASE_URL, o19BaseUrl);

    // Initialize a new OAuth manager with the new base URL if the client key and client secret are present
    if (
      SecureKeyStore.getKey(CustomKeyType.CLIENT_KEY) &&
      SecureKeyStore.getKey(CustomKeyType.CLIENT_SECRET)
    ) {
      setManager(new OAuthManager());
    }

    SecureKeyStore.deleteKey(CustomKeyType.ACCESS_TOKEN);
    SecureKeyStore.deleteKey(CustomKeyType.SECRET_KEY);

    setHasAccessToken(false);
    Keyboard.dismiss();
    Alert.alert('Settings saved successfully');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>O19 Base URL:</Text>
      <TextInput
        value={o19BaseUrl}
        onChangeText={setO19BaseUrl}
        placeholder="Enter Base Url"
        style={styles.input}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    display: 'flex',
    gap: 10,
  },
});

export default SettingPage;
