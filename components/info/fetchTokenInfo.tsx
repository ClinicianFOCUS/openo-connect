import { Text } from 'react-native';
import infoStyles from './info.styles';

const LoginInfo = () => {
  return (
    <>
      <Text style={infoStyles.title}>
        Important: Make sure to provide O19 base url in setting before fetching
        token.
      </Text>
      <Text style={infoStyles.paragraph}>
        Stored credentials are used to fetch token from O19 server.
      </Text>
      <Text style={infoStyles.paragraph}>
        If you have recently changed your password, then you will be taken to
        login screen after pressing fetch button.
      </Text>
    </>
  );
};

export default LoginInfo;
