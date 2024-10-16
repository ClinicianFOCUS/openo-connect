import {
  AUTHORIZE_OAUTH,
  FILL_LOGIN_FORM_AND_SUBMIT,
  INJECT_JQUERY,
} from '@/scripts/scripts';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { CustomKeyType, StatusType } from '@/types/types';
import { constructUrl } from '@/utils/utils';
import React, { createRef, useState } from 'react';
import { Button, View, StyleSheet, Alert } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

const FetchToken = () => {
  const [endpoint, setEndpoint] = useState<string>();
  const [loginAttempt, setLoginAttempt] = useState<number>(0);
  const [webViewKey, setWebViewKey] = useState(0);
  const [buttonText, setButtonText] = useState<string>('Fetch Access Token');

  const webViewRef = createRef<WebView>();
  const { manager, setHasUserCredentials } = useAuthManagerStore();

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    if (navigationState.loading || !webViewRef.current) {
      return;
    }

    const url = navigationState.url;
    const username = SecureKeyStore.getKey(CustomKeyType.USERNAME);
    const password = SecureKeyStore.getKey(CustomKeyType.PASSWORD);
    const pin = SecureKeyStore.getKey(CustomKeyType.PIN);

    if (!username || !password || !pin) {
      return;
    }
    // Inject login credentials if the URL is the login page (oscar/index.jsp)
    if (url.includes('oscar/index.jsp') && loginAttempt == 0) {
      console.log('INJECTING FILLED FORM');
      webViewRef.current.injectJavaScript(
        FILL_LOGIN_FORM_AND_SUBMIT(username, password, pin)
      );
      setLoginAttempt(loginAttempt + 1);
    }

    // If the login attempt is 1 and the URL is still the login page, then the login failed
    if (url.includes('oscar/index.jsp') && loginAttempt == 1) {
      SecureKeyStore.deleteKey(CustomKeyType.USERNAME);
      SecureKeyStore.deleteKey(CustomKeyType.PASSWORD);
      SecureKeyStore.deleteKey(CustomKeyType.PIN);
      setHasUserCredentials(false);
      Alert.alert('Invalid Credentials. Please try again.');
    }

    // If webview is on login.do, then the account is locked
    if (url.includes('oscar/login.do')) {
      SecureKeyStore.deleteKey(CustomKeyType.USERNAME);
      SecureKeyStore.deleteKey(CustomKeyType.PASSWORD);
      SecureKeyStore.deleteKey(CustomKeyType.PIN);
      setHasUserCredentials(false);
      Alert.alert(
        'Your account has been locked. Please contact an administrator.'
      );
    }

    // If the URL is not the login page (oscar/index.jsp) or login.do or oauth/authorize, inject query to get/set client key and secret
    if (url.includes('oscar/provider')) {
      console.log('Logged In. Starting OAuth Process.');
      initiateOAuthFlow().then((authUrl) => {
        if (authUrl) {
          setEndpoint(authUrl);
        }
      });
    }

    if (url.includes('oauth/authorize')) {
      console.log('Injecting JQuery');
      webViewRef.current.injectJavaScript(INJECT_JQUERY());
      webViewRef.current.injectJavaScript(AUTHORIZE_OAUTH());
    }
  };

  /**
   * Initiates the OAuth flow by requesting a token and getting the authorization URL.
   * If the request is successful, it returns the authorization URL.
   * If the request fails, it shows an alert and navigates back.
   *
   * @returns {Promise<string | undefined>} The authorization URL or undefined if the request fails.
   */
  const initiateOAuthFlow = async () => {
    if (manager) {
      const res = await manager.getRequestToken();

      if (res.status == StatusType.SUCCESS) {
        const authUrl = manager.getAuthorizationUrl();
        return authUrl;
      } else {
        Alert.alert('Error', res.message, [
          { text: 'Failed to get request token.' },
        ]);
      }
    }
  };

  const fetchAccessToken = () => {
    const url = constructUrl('/index.jsp');
    setButtonText('Fetching Token');
    setEndpoint(url);
    setLoginAttempt(0);
    setWebViewKey((prevKey) => prevKey + 1);
  };

  return (
    <View style={styles.container}>
      <Button
        title={buttonText}
        onPress={fetchAccessToken}
        disabled={buttonText == 'Fetching Token'}
      />
      {endpoint && (
        <WebView
          key={webViewKey}
          style={styles.webview}
          ref={webViewRef}
          source={{
            uri: endpoint,
          }}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled={true}
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '60%',
    display: 'flex',
  },
  webview: {
    position: 'absolute',
    display: 'none',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
});

export default FetchToken;
