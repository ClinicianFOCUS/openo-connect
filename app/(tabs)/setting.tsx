import OAuthManager from "@/services/OAuthManager";
import { SecureKeyStore } from "@/services/SecureKeyStore";
import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { CustomKeyType } from "@/types/types";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const SettingPage = () => {
  const { setManager, setHasAccessToken } = useAuthManagerStore();
  const [clientKey, setClientKey] = useState(
    SecureKeyStore.getKey(CustomKeyType.CLIENT_KEY) || ""
  );
  const [clientSecret, setClientSecret] = useState(
    SecureKeyStore.getKey(CustomKeyType.CLIENT_SECRET) || ""
  );
  const [oscarBaseUrl, setOscarBaseUrl] = useState(
    SecureKeyStore.getKey(CustomKeyType.OSCAR_BASE_URL) || ""
  );
  const CALLBACK_URL = Constants.experienceUrl;

  const handleSave = () => {
    SecureKeyStore.saveKey(CustomKeyType.CLIENT_KEY, clientKey);
    SecureKeyStore.saveKey(CustomKeyType.CLIENT_SECRET, clientSecret);
    SecureKeyStore.saveKey(CustomKeyType.OSCAR_BASE_URL, oscarBaseUrl);
    setManager(new OAuthManager());
    SecureKeyStore.deleteKey(CustomKeyType.ACCESS_TOKEN);
    SecureKeyStore.deleteKey(CustomKeyType.SECRET_KEY);
    setHasAccessToken(false);
    Keyboard.dismiss();
    Alert.alert("Settings saved successfully");
  };

  const handleCopyCallbackUrl = async () => {
    await Clipboard.setStringAsync(CALLBACK_URL);
    Alert.alert("Callback URL copied to clipboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>Client Key:</Text>
      <TextInput
        value={clientKey}
        onChangeText={setClientKey}
        placeholder="Enter Public Key"
        style={styles.input}
      />
      <Text style={styles.inputLabel}>Client Secret:</Text>
      <TextInput
        value={clientSecret}
        onChangeText={setClientSecret}
        placeholder="Enter Private Key"
        style={styles.input}
      />
      <Text style={styles.inputLabel}>Oscar Base URL:</Text>
      <TextInput
        value={oscarBaseUrl}
        onChangeText={setOscarBaseUrl}
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
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    padding: 20,
    display: "flex",
    gap: 10,
  },
  callbackUrlContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
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
