import { CustomResponse, StatusType } from '@/types/types';
import * as LocalAuthentication from 'expo-local-authentication';

// Function to authenticate the user
export const authenticateUser = async (): Promise<CustomResponse> => {
  // Check if the device has the necessary hardware for local authentication
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware)
    return {
      status: StatusType.SUCCESS,
      message: 'No hardware found',
    }; // Exit if no hardware is available

  // Check if the user has enrolled in local authentication (e.g., fingerprint, face recognition)
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled)
    return {
      status: StatusType.SUCCESS,
      message: 'User has not enrolled local authentication',
    }; // Exit if no enrollment is found

  // Prompt the user to authenticate
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access the app',
  });

  // Handle the authentication result
  if (!result.success) {
    return {
      status: StatusType.ERROR,
      message: 'Authentication failed',
    };
    // Optionally, navigate to a login screen or exit the app
  } else {
    console.log('Authentication Success');
    return {
      status: StatusType.SUCCESS,
      message: 'Authentication successful',
    };
  }
};
