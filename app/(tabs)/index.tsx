// App.js

import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useOAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";
import AppointmentList from "@/components/AppointmentList";

const App = () => {
  const { hasAccessToken } = useOAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {hasAccessToken ? (
        <AppointmentList />
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
