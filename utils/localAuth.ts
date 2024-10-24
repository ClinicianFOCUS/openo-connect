import { CustomResponse, StatusType } from '@/types/types';
import * as LocalAuthentication from 'expo-local-authentication';

// Function to authenticate the user
export const authenticateUser = async (): Promise<CustomResponse> => {
  const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();

  // Check if the device has any kind of authentication enrolled
  if (securityLevel === LocalAuthentication.SecurityLevel.NONE) {
    return {
      status: StatusType.SUCCESS,
      message: 'User has not enrolled any kind of authentication',
    };
  }

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
