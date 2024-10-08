import CameraComponent from "@/components/CameraComponent";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const Camera = () => {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1 }}>
      <CameraComponent
        demographicNo={parseInt(Array.isArray(id) ? id[0] : id)}
      />
    </View>
  );
};

export default Camera;
