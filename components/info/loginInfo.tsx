import { Text } from 'react-native';
import infoStyles from './info.styles';

const LoginInfo = () => {
  return (
    <>
      <Text style={infoStyles.title}>
        Important: Make sure to provide O19 base url in setting before logging
        in.
      </Text>
      <Text style={infoStyles.paragraph}>
        Please enter your login credentials to access the application. If you
        don't have an account, please contact support for assistance.
      </Text>
      <Text style={infoStyles.paragraph}>
        Your credentials are stored securely on your device and are not shared
        with anyone. Stored credentials are used for authentication purpose in
        the future.
      </Text>
    </>
  );
};

export default LoginInfo;
