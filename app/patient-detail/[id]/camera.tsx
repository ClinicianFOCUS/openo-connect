/**
 * Component to display the camera for a patient.
 */
import CameraComponent from '@/components/CameraComponent';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Camera component that handles camera permissions and image uploading.
 *
 * This component requests camera permissions from the user and displays the camera
 * if permissions are granted. It also handles the image upload process and displays
 * appropriate messages during and after the upload.
 *
 * @returns {JSX.Element} The rendered Camera component.
 *
 * @remarks
 * - If the camera permission is not granted, a message and a button to request permission are displayed.
 * - If the camera permission is granted, the camera component is displayed along with upload status messages.
 *
 * @component
 *
 * @example
 * ```tsx
 * <Camera />
 * ```
 */
const Camera = () => {
  const { id } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const { uploading, uploaded, uploadMessage, uploadImage, setUploaded } =
    useImageUpload(parseInt(Array.isArray(id) ? id[0] : id));

  // If permission object is not available, return an empty view
  if (!permission) {
    return <View />;
  }

  // If camera permission is not granted, show a message and a button to request permission
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // If permission is granted, display the camera component and handle upload status
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
    justifyContent: 'center',
  },
  uploadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  uploadingText: {
    fontSize: 24,
    color: 'white',
  },
  uploadedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  uploadedText: {
    fontSize: 24,
    color: 'white',
  },
  okButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  okButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Camera;
