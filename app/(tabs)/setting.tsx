import { SecureKeyStore } from "@/services/SecureKeyStore";
import { CustomKeyType } from "@/types/types";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const SettingPage = () => {
  const [clientKey, setClientKey] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  //   const maskKey = (key) => {
  //     return key ? key.slice(0, 4) + "*".repeat(key.length - 4) : "";
  //   };

  const handleSave = () => {
    // Implement secure storage logic here
    console.log("Public Key:", clientKey);
    console.log("Private Key:", clientSecret);
    SecureKeyStore.saveKey(CustomKeyType.CLIENT_KEY, clientKey);
    SecureKeyStore.saveKey(CustomKeyType.CLIENT_SECRET, clientSecret);
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
      <Button title="Save" onPress={handleSave} />
      {/* <Text>Stored Public Key: {maskKey(publicKey)}</Text>
      <Text>Stored Private Key: {maskKey(privateKey)}</Text> */}
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
