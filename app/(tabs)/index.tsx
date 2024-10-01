// App.js

import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useOAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";

const App = () => {
  const { hasAccessToken, callApi } = useOAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {hasAccessToken ? (
        <Button title={"Call api"} onPress={callApi} />
      ) : (
        <Button
          title="Login with OSCAR"
          onPress={() => navigation.navigate("o19-login/index")}
        />
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
