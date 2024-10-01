import { useOAuth } from "@/hooks/useAuth";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const OscarLogin = () => {
  const { initiateOAuthFlow } = useOAuth();
  const [endpoint, setEndpoint] = useState<string>();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  1;
  useEffect(() => {
    initiateOAuthFlow().then((url) => {
      setEndpoint(url);
    });
  }, []);

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

export default OscarLogin;
