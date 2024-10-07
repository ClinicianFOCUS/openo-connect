import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { CameraView, CameraProps, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App({
  demographicNo,
}: {
  demographicNo: number;
  providerNo: string;
}) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraProps["facing"]>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const { manager, provider } = useAuthManagerStore();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ base64: true });
    setUploading(true);

    const data = {
      type: "photo",
      fileName: "image_test",
      description: "image test",
      contentType: "image/jpeg",
      numberOfPages: 1,
      providerNo: provider.id,
      demographicNo: demographicNo,
      fileContents: photo?.base64,
    };

    manager
      ?.makeAuthorizedRequest(
        "POST",
        "document/saveDocumentToDemographic",
        data
      )
      .then((res) => {
        setUploading(false);
        setUploaded(true);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      <View>
        <Button title="Take Picture" onPress={takePicture} />
      </View>

      {uploading && (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      )}

      {uploaded && (
        <View style={styles.uploadedContainer}>
          <Text style={styles.uploadedText}>Image Uploaded Successfully!</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
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
