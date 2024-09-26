import { SecureKeyStore } from "@/services/SecureKeyStore";
import { CustomKeyType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const SettingPage = () => {
  const [clientKey, setClientKey] = useState(
    SecureKeyStore.getKey(CustomKeyType.CLIENT_KEY) || ""
  );
  const [clientSecret, setClientSecret] = useState(
    SecureKeyStore.getKey(CustomKeyType.CLIENT_SECRET) || ""
  );
  const [oscarBaseUrl, setOscarBaseUrl] = useState(
    SecureKeyStore.getKey(CustomKeyType.OSCAR_BASE_URL) || ""
  );

  const handleSave = () => {
    SecureKeyStore.saveKey(CustomKeyType.CLIENT_KEY, clientKey);
    SecureKeyStore.saveKey(CustomKeyType.CLIENT_SECRET, clientSecret);
    SecureKeyStore.saveKey(CustomKeyType.OSCAR_BASE_URL, oscarBaseUrl);
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
});

export default SettingPage;
