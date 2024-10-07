import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { CameraView, CameraProps, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App({
  demographicNo,
  providerNo,
}: {
  demographicNo: number;
  providerNo: string;
}) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraProps["facing"]>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const { manager } = useAuthManagerStore();

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
    alert(`photo captured with dimensions: ${photo!.width} x ${photo!.height}`);

    const data = {
      type: "photo",
      fileName: "image_test",
      description: "image test",
      contentType: "image/jpeg",
      numberOfPages: 1,
      providerNo: providerNo,
      demographicNo: demographicNo,
      fileContents: photo?.base64,
    };

    manager
      ?.makeAuthorizedRequest(
        "POST",
        "document/saveDocumentToDemographic",
        data
      )
      .then((res) => {});
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
});
