import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { StatusType } from "@/types/types";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";

/**
 * O19Login component handles the OAuth login flow using a WebView.
 * It initiates the OAuth flow, injects jQuery into the WebView, and manages loading states.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const O19Login = () => {
  const { manager } = useAuthManagerStore();
  const [endpoint, setEndpoint] = useState<string>();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    initiateOAuthFlow().then((url) => {
      setEndpoint(url);
    });
  }, []);

  /**
   * Initiates the OAuth flow by requesting a token and getting the authorization URL.
   * If the request is successful, it returns the authorization URL.
   * If the request fails, it shows an alert and navigates back.
   *
   * @returns {Promise<string | undefined>} The authorization URL or undefined if the request fails.
   */
  const initiateOAuthFlow = async () => {
    if (manager) {
      const res = await manager.getRequestToken();

      if (res.status == StatusType.SUCCESS) {
        const authUrl = manager.getAuthorizationUrl();
        return authUrl;
      } else {
        Alert.alert("Error", res.message, [
          { text: "Go Back", onPress: () => navigation.goBack() },
        ]);
      }
    }
  };

  // jQuery injection script
  const injectJQuery = `
    (function() {
      var script = document.createElement('script');
      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
      script.type = 'text/javascript';
      document.head.appendChild(script);
    })();
    true; // returning true to indicate script has been injected
  `;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      )}
      {endpoint && (
        <WebView
          style={styles.webview}
          ref={webViewRef}
          source={{ uri: endpoint }}
          injectedJavaScript={injectJQuery}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default O19Login;
