import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, CameraProps } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import { useState, useRef, useCallback } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraComponentProps {
  uploadImage: (base64: string) => void;
}

/**
 * CameraComponent is a React functional component that provides a camera interface.
 * It allows users to toggle between the front and back camera and take pictures.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {function} props.uploadImage - Callback function to handle the captured photo's base64 string.
 *
 * @returns {JSX.Element} The rendered camera component.
 *
 * @example
 * <CameraComponent uploadImage={(base64) => console.log(base64)} />
 */
export default function CameraComponent({ uploadImage }: CameraComponentProps) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraProps['facing']>('back');
  const [pausePreview, setPausePreview] = useState(false);
  const [base64Image, setBase64Image] = useState('');

  // Resume the camera preview when the component is focused. ie. when the user navigates back to the camera screen
  useFocusEffect(
    useCallback(() => {
      resumePreview();
    }, [])
  );

  // Function to toggle between front and back camera
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Function to take a picture and pause the preview
  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ base64: true });
    if (photo?.base64) {
      setBase64Image(photo.base64);
    }
    await cameraRef.current?.pausePreview();
    setPausePreview(true);
  };

  // Function to upload the captured image
  const onUpload = () => {
    if (base64Image) {
      uploadImage(base64Image);
    }
    resumePreview();
  };

  // Function to resume the camera preview
  const resumePreview = async () => {
    await cameraRef.current?.resumePreview();
    setPausePreview(false);
    setBase64Image('');
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {pausePreview ? (
            <View style={styles.buttonContainer2}>
              <View style={styles.previewPausedButton}>
                <TouchableOpacity onPress={resumePreview}>
                  <Ionicons name="reload" size={50} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.previewPausedButton}>
                <TouchableOpacity onPress={onUpload}>
                  <Ionicons name="cloud-upload" size={50} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.buttonFlip}>
                <TouchableOpacity onPress={toggleCameraFacing}>
                  <Ionicons name="camera-reverse" size={36} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonCapture}>
                <TouchableOpacity onPress={takePicture}>
                  <View
                    style={{
                      borderWidth: 5,
                      borderColor: 'white',
                      borderRadius: 50,
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 50,
                        height: 60,
                        width: 60,
                        backgroundColor: '#A9A9A9',
                      }}
                    ></View>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 10,
  },
  buttonFlip: { flex: 1, alignItems: 'flex-end' },
  buttonCapture: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 25,
  },
  previewPausedButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer2: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 25,
  },
});
