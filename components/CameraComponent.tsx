import { CameraView, CameraProps } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CameraComponentProps {
  onCapture: (base64: string) => void;
}

/**
 * CameraComponent is a React functional component that provides a camera interface.
 * It allows users to toggle between the front and back camera and take pictures.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {function} props.onCapture - Callback function to handle the captured photo's base64 string.
 *
 * @returns {JSX.Element} The rendered camera component.
 *
 * @example
 * <CameraComponent onCapture={(base64) => console.log(base64)} />
 */
export default function CameraComponent({ onCapture }: CameraComponentProps) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraProps["facing"]>("back");

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ base64: true });
    if (photo?.base64) {
      onCapture(photo.base64);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Button title="Take Picture" onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
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
