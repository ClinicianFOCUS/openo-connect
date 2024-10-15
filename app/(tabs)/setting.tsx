import OAuthManager from '@/services/OAuthManager';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { CustomKeyType } from '@/types/types';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SettingPage = () => {
  const { setManager, setHasAccessToken } = useAuthManagerStore();
  const [o19BaseUrl, setO19BaseUrl] = useState(
    SecureKeyStore.getKey(CustomKeyType.O19_BASE_URL) || ''
  );
  const CALLBACK_URL = Constants.experienceUrl;

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
    SecureKeyStore.saveKey(CustomKeyType.O19_BASE_URL, o19BaseUrl);
    setManager(new OAuthManager());
    SecureKeyStore.deleteKey(CustomKeyType.ACCESS_TOKEN);
    SecureKeyStore.deleteKey(CustomKeyType.SECRET_KEY);
    setHasAccessToken(false);
    Keyboard.dismiss();
    Alert.alert('Settings saved successfully');
  };

  /**
   * Copies the CALLBACK_URL to the clipboard and displays an alert.
   *
   * @async
   * @function handleCopyCallbackUrl
   * @returns {Promise<void>} A promise that resolves when the URL has been copied and the alert has been shown.
   */
  const handleCopyCallbackUrl = async () => {
    await Clipboard.setStringAsync(CALLBACK_URL);
    Alert.alert('Callback URL copied to clipboard');
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
      <Text style={styles.inputLabel}>Callback URL:</Text>
      <View style={styles.callbackUrlContainer}>
        <Text style={styles.callbackUrlText}>{CALLBACK_URL}</Text>
        <TouchableOpacity onPress={handleCopyCallbackUrl}>
          <Text style={styles.copyButton}>
            <Ionicons name="copy" size={16} />
          </Text>
        </TouchableOpacity>
      </View>
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
  callbackUrlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  callbackUrlText: {
    flex: 1,
    fontSize: 16,
  },
  copyButton: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SettingPage;
