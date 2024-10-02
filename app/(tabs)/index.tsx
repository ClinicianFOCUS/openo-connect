// App.js

import React from "react";
import { View, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useOAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";
import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import AppointmentList from "@/components/AppointmentList";

const App = () => {
  const { loading } = useOAuth();
  const { hasAccessToken } = useAuthManagerStore();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : hasAccessToken ? (
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
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
});

export default App;
