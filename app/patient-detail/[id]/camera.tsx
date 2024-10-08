/**
 * Component to display the camera for a patient.
 */
import CameraComponent from "@/components/CameraComponent";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

/**
 * Camera component.
 * @returns {JSX.Element} The rendered component.
 */
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
