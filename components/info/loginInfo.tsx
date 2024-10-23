import { StyleSheet, Text } from 'react-native';

const LoginInfo = () => {
  return (
    <>
      <Text style={styles.title}>
        Important: Make sure to provide O19 base url in setting before logging
        in.
      </Text>
      <Text style={styles.paragraph}>
        Please enter your login credentials to access the application. If you
        don't have an account, please contact support for assistance.
      </Text>
      <Text style={styles.paragraph}>
        Your credentials are stored securely on your device and are not shared
        with anyone. Stored credentials are used for authentication purpose in
        the future.
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

export default LoginInfo;
