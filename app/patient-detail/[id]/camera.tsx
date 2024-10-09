/**
 * Component to display the camera for a patient.
 */
import CameraComponent from "@/components/CameraComponent";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useCameraPermissions } from "expo-camera";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";

/**
 * Camera component.
 * @returns {JSX.Element} The rendered component.
 */
const Camera = () => {
  const { id } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const { uploading, uploaded, uploadMessage, uploadImage, setUploaded } =
    useImageUpload(parseInt(Array.isArray(id) ? id[0] : id));

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CameraComponent onCapture={uploadImage} />
      {uploading && (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      )}
      {uploaded && (
        <View style={styles.uploadedContainer}>
          <Text style={styles.uploadedText}>{uploadMessage}</Text>
          <TouchableOpacity
            style={styles.okButton}
            onPress={() => setUploaded(false)}
          >
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  uploadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  uploadingText: {
    fontSize: 24,
    color: "white",
  },
  uploadedContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  uploadedText: {
    fontSize: 24,
    color: "white",
  },
  okButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  okButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default Camera;
