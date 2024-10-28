/**
 * Component to display the camera for a patient.
 */
import CameraComponent from '@/components/CameraComponent';
import CustomModal from '@/components/CustomModal';
import CameraInfo from '@/components/info/cameraInfo';
import useCurrentRoute from '@/hooks/useCurrentRoute';
import { useImageUpload } from '@/hooks/useImageUpload';
import usePatientName from '@/hooks/usePatientName';
import { useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
  // this sets the current route so that the app can return to it after authentication(biometrics)
  useCurrentRoute();

  // Used to update the title of the screen to the patient's name
  usePatientName();

  const { id } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [askingPermission, setAskingPermission] = useState(false);
  const { uploading, uploaded, uploadMessage, uploadImage, setUploaded } =
    useImageUpload(parseInt(Array.isArray(id) ? id[0] : id));

  const ModelComponent = () => {
    return (
      <CustomModal title="Camera Information">
        <CameraInfo />
      </CustomModal>
    );
  };

  // If permission object is not available, return an empty view
  if (!permission) {
    return <View>{ModelComponent()}</View>;
  }

  // If camera permission is denied, display a message
  if (permission.status === 'denied') {
    return (
      <View style={[styles.container, styles.padding]}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
          }}
        >
          Camera Access Denied
        </Text>
        <Text style={{ textAlign: 'center' }}>
          Please allow Open O Connect to access your camera from device
          settings.
        </Text>
        {ModelComponent()}
      </View>
    );
  }

  // If camera permission is not granted request permission
  if (!permission.granted && !askingPermission) {
    setAskingPermission(true);
    requestPermission();
  }

  // If permission is granted, display the camera component and handle upload status
  return (
    <View style={styles.container}>
      <CameraComponent uploadImage={uploadImage} />
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
      {ModelComponent()}
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
  padding: {
    padding: 20,
  },
});

export default Camera;
