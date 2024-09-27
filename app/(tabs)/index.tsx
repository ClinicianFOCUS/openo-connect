// App.js

import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useOAuth } from "@/hooks/useAuth";

const App = () => {
  const { hasAccessToken, initiateOAuthFlow, callApi } = useOAuth();

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
