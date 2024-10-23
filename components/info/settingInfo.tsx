import { StyleSheet, Text } from 'react-native';

const SettingInfo = () => {
  return (
    <>
      <Text style={styles.title}>
        Important: Make sure to provide O19 base url in setting before logging
        in. Base URL should not have a trailing slash.
      </Text>
      <Text style={styles.paragraph}>
        For eg: https://example.com is a valid base URL.
      </Text>
      <Text style={styles.paragraph}>
        For eg: https://example.com/ is not a valid base URL.
      </Text>
      <Text style={styles.paragraph}>
        Also, you will have to fetch access token again after changing the base
        URL. If your credentials are same, then you can fetch access token
        directly.
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  paragraph: {
    marginBottom: 10,
    color: '#666',
    lineHeight: 22,
  },
});

export default SettingInfo;
