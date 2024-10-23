import { Text } from 'react-native';
import infoStyles from './info.styles';

const SettingInfo = () => {
  return (
    <>
      <Text style={infoStyles.title}>
        Important: Make sure to provide O19 base url in setting before logging
        in. Base URL should not have a trailing slash.
      </Text>
      <Text style={infoStyles.paragraph}>
        For eg: https://example.com is a valid base URL.
      </Text>
      <Text style={infoStyles.paragraph}>
        For eg: https://example.com/ is not a valid base URL.
      </Text>
      <Text style={infoStyles.paragraph}>
        Also, you will have to fetch access token again after changing the base
        URL. If your credentials are same, then you can fetch access token
        directly.
      </Text>
    </>
  );
};

export default SettingInfo;
