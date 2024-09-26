// App.js

import React, { useEffect } from "react";
import { View, Button, Linking, Alert, StyleSheet } from "react-native";
import OAuthManager from "../../services/OAuthManager";
import { openBrowserAsync } from "expo-web-browser";
import { useAuthManager } from "@/store/useAuthManager";
import { SecureKeyStore } from "@/services/SecureKeyStore";
import { CustomKeyType } from "@/types/types";

const App = () => {
  const { manager, setManager, hasAccessToken, setHasAccessToken } =
    useAuthManager();

  useEffect(() => {
    if (
      SecureKeyStore.getKey(CustomKeyType.ACCESS_TOKEN) &&
      SecureKeyStore.getKey(CustomKeyType.ACCESS_TOKEN_SECRET)
    )
      setHasAccessToken(true);
    if (manager) return;

    let oauthManager: OAuthManager;
    try {
      oauthManager = new OAuthManager();
      setManager(oauthManager);
    } catch (error) {
      console.error("Error creating OAuthManager", error);
    }

    // Handle OAuth callback
    const handleUrl = (event: { url: string }) => {
      const url = event.url;
      if (url.startsWith("exp://192.168.2.83:8081")) {
        const params = new URLSearchParams(url.split("?")[1]);
        const oauth_verifier = params.get("oauth_verifier");

        // Step 5: Exchange the request token for an access token
        oauthManager
          .getAccessToken(oauth_verifier)
          .then((success) => {
            if (success) {
              Alert.alert("Access Granted");
              setHasAccessToken(true);
            }
          })
          .catch((error) => {
            console.error("Error getting access token", error);
          });
      }
    };

    Linking.addEventListener("url", handleUrl);
  }, []);

  const initiateOAuthFlow = async () => {
    if (manager) {
      await manager.getRequestToken();

      const authUrl = manager.getAuthorizationUrl();

      openBrowserAsync(authUrl);
    }
  };

  const callApi = () => {
    if (manager) {
      manager.makeAuthorizedRequest("providerService/providers_json");
    }
  };

  return (
    <View style={styles.container}>
      {hasAccessToken ? (
        <Button title={"Call api"} onPress={callApi} />
      ) : (
        <Button title="Login with OSCAR" onPress={initiateOAuthFlow} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
