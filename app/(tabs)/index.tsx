// App.js

import React, { useEffect, useState } from "react";
import { Button, Linking, Alert } from "react-native";
import OAuthManager from "../../services/OAuthManager";
import { openBrowserAsync } from "expo-web-browser";

const App = () => {
  const [oauthManager, setOAuthManager] = useState<OAuthManager>();

  useEffect(() => {
    const manager = new OAuthManager();
    setOAuthManager(manager);

    // Handle OAuth callback
    const handleUrl = (event: { url: string }) => {
      const url = event.url;
      if (url.startsWith("exp://192.168.2.83:8081")) {
        const params = new URLSearchParams(url.split("?")[1]);
        const oauth_verifier = params.get("oauth_verifier");

        // Step 5: Exchange the request token for an access token
        manager
          .getAccessToken(oauth_verifier)
          .then(() => {
            Alert.alert("Access Granted");
          })
          .catch((error) => {
            console.error("Error getting access token", error);
          });
      }
    };

    Linking.addEventListener("url", handleUrl);
  }, []);

  const initiateOAuthFlow = async () => {
    if (oauthManager) {
      await oauthManager.getRequestToken();

      const authUrl = oauthManager.getAuthorizationUrl();

      openBrowserAsync(authUrl);
    }
  };

  const callApi = () => {
    if (oauthManager) {
      oauthManager.makeAuthorizedRequest("providerService/providers_json");
    }
  };

  return (
    <>
      <Button title="Login with OSCAR" onPress={initiateOAuthFlow} />
      <Button title={"Call api"} onPress={callApi} />
    </>
  );
};

export default App;
