// useOAuth.js
import { useEffect, useState } from "react";
import { Alert, EmitterSubscription, Linking } from "react-native";
import OAuthManager from "@/services/OAuthManager";
import { SecureKeyStore } from "@/services/SecureKeyStore";
import { CustomKeyType, StatusType } from "@/types/types";
import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import Constants from "expo-constants";

export const useOAuth = () => {
  const { manager, setManager, setHasAccessToken } = useAuthManagerStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (
      SecureKeyStore.getKey(CustomKeyType.ACCESS_TOKEN) &&
      SecureKeyStore.getKey(CustomKeyType.SECRET_KEY)
    ) {
      setHasAccessToken(true);
    }

    if (!manager) {
      initManager();
    }

    let callbackListener: EmitterSubscription;
    if (manager) {
      callbackListener = Linking.addEventListener("url", (event) =>
        handleUrl(event, manager)
      );
    }

    setLoading(false);

    return () => {
      callbackListener?.remove();
    };
  }, [manager]);

  const initManager = async () => {
    try {
      setManager(new OAuthManager());
    } catch (error) {
      console.error("Error creating OAuthManager", error);
    }
  };

  // Handle OAuth callback
  const handleUrl = async (event: { url: string }, manager: OAuthManager) => {
    const baseUrl = Constants.experienceUrl;
    const { url } = event;
    if (url.startsWith(baseUrl)) {
      const params = new URLSearchParams(url.split("?")[1]);
      const oauth_verifier = params.get("oauth_verifier") || "";

      // Step 5: Exchange the request token for an access token
      const res = await manager.getAccessToken(oauth_verifier);

      if (res.status == StatusType.SUCCESS) {
        setHasAccessToken(true);
        Alert.alert("Access Granted");
      } else {
        Alert.alert("Error", "Failed to get access token");
      }
    }
  };

  const callApi = () => {
    if (manager) {
      manager.makeAuthorizedRequest("providerService/providers_json");
    }
  };

  return { callApi, loading };
};
