import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { CustomKeyType, CustomResponse, StatusType } from '@/types/types';
import axios from 'axios';
import React, { createRef, useState } from 'react';
import { View, StyleSheet, Alert, Button, Text, TextInput } from 'react-native';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import { XMLParser } from 'fast-xml-parser';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import OAuthManager from '@/services/OAuthManager';
import {
  AUTHORIZE_OAUTH,
  FILL_LOGIN_FORM_AND_SUBMIT,
  INJECT_JQUERY,
  SEND_GET_REQUEST,
} from '@/scripts/scripts';
import { constructUrl } from '@/utils/utils';

/**
 * O19Login component handles the OAuth login flow using a WebView.
 * It initiates the OAuth flow, injects jQuery into the WebView, and manages loading states.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const Login = () => {
  const [endpoint, setEndpoint] = useState<string>();
  const [loginText, setLoginText] = useState<string>('Login');
  const [providerNo, setProviderNo] = useState<string>();
  const [loginAttempt, setLoginAttempt] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [webViewKey, setWebViewKey] = useState(0);

  const { setManager } = useAuthManagerStore();
  const webViewRef = createRef<WebView>();

  /**
   * Initiates the OAuth flow by requesting a token and getting the authorization URL.
   * If the request is successful, it returns the authorization URL.
   * If the request fails, it shows an alert and navigates back.
   *
   * @returns {Promise<string | undefined>} The authorization URL or undefined if the request fails.
   */
  const initiateOAuthFlow = async () => {
    const manager = new OAuthManager();
    setManager(manager);
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

  /**
   * Sends a SOAP request to the specified URL to retrieve the provider number.
   *
   * @param {string} url - The URL to which the SOAP request is sent.
   * @returns {Promise<AxiosResponse<any>>} - A promise that resolves to the response of the SOAP request.
   *
   * @example
   * const url = 'https://example.com/soap-endpoint';
   * getProviderNumber(url)
   *   .then(response => {
   *     console.log(response.data);
   *   })
   *   .catch(error => {
   *     console.error('Error:', error);
   *   });
   */
  const getProviderNumber = async (url: string) => {
    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <login2 xmlns="http://ws.oscarehr.org/">
          <arg0 xmlns="">${username}</arg0>
          <arg1 xmlns="">${password}</arg1>
        </login2>
      </soap:Body>
    </soap:Envelope>`;

    return axios.post(url, xmlBody, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  };

  /**
   * Handles the navigation state changes of the WebView.
   *
   * @param {WebViewNavigation} navigationState - The current state of the WebView navigation.
   *
   * This function performs the following actions based on the URL of the navigation state:
   * - If the URL is the login page (`oscar/index.jsp`) and it's the first login attempt, it injects the login form and submits it.
   * - If the URL is still the login page after one login attempt, it deletes stored credentials and sets a login error message.
   * - If the URL is `oscar/login.do`, it deletes stored credentials and sets an account locked error message.
   * - If the URL is not the login page, `login.do`, or `oauth/authorize`, it injects a query to get/set the client key and secret.
   * - If the URL is `oauth/authorize`, it injects JQuery and authorizes OAuth.
   */
  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    if (navigationState.loading || !webViewRef.current) {
      return;
    }

    const url = navigationState.url;

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
      setLoginError('Failed to login. Please try again.');
      setLoginText('Login');
    }

    // If webview is on login.do, then the account is locked
    if (url.includes('oscar/login.do')) {
      SecureKeyStore.deleteKey(CustomKeyType.USERNAME);
      SecureKeyStore.deleteKey(CustomKeyType.PASSWORD);
      SecureKeyStore.deleteKey(CustomKeyType.PIN);
      setLoginError(
        'Due to multiple failed login attempts, the account is locked. Please contact your administrator to unlock.'
      );
      setLoginText('Login');
    }

    // If the URL is not the login page (oscar/index.jsp) or login.do or oauth/authorize, inject query to get/set client key and secret
    if (url.includes('oscar/provider')) {
      console.log('INJECTING QUERY TO GET KEY');
      setLoginText('Getting Key');
      providerNo &&
        webViewRef.current.injectJavaScript(SEND_GET_REQUEST(providerNo));
    }

    if (url.includes('oauth/authorize')) {
      console.log('Injecting JQuery');
      webViewRef.current.injectJavaScript(INJECT_JQUERY());
      webViewRef.current.injectJavaScript(AUTHORIZE_OAUTH());
    }
  };

  /**
   * Handles the login process by performing the following steps:
   * 1. Updates the login text to indicate the login process has started.
   * 2. Saves the username, password, and PIN to the secure key store.
   * 3. Sends a request to the login service to get the provider number.
   * 4. Parses the xml response to extract the provider number.
   * 5. Updates the provider number, endpoint, and other state variables upon successful login.
   * 6. Handles login failure by deleting the saved keys and updating the login error message.
   *
   * @returns {void}
   */
  const handleLogin = () => {
    setLoginText('Logging in...');
    setLoginError('');
    SecureKeyStore.saveKey(CustomKeyType.USERNAME, username);
    SecureKeyStore.saveKey(CustomKeyType.PASSWORD, password);
    SecureKeyStore.saveKey(CustomKeyType.PIN, pin);
    getProviderNumber(constructUrl('/ws/LoginService'))
      .then((response) => {
        const parser = new XMLParser();
        let obj = parser.parse(response.data);
        const providerNo =
          obj['soap:Envelope']['soap:Body']['ns2:login2Response'].return
            .provider.providerNo;
        setProviderNo(providerNo);
        setEndpoint(constructUrl('/index.jsp'));
        setLoginAttempt(0);
        setWebViewKey((prevKey) => prevKey + 1);
      })
      .catch(() => {
        SecureKeyStore.deleteKey(CustomKeyType.USERNAME);
        SecureKeyStore.deleteKey(CustomKeyType.PASSWORD);
        SecureKeyStore.deleteKey(CustomKeyType.PIN);
        setLoginError('Failed to login. Please try again.');
        setLoginText('Login');
      });
  };

  /**
   * Handles messages received from the WebView.
   *
   * @param {WebViewMessageEvent} event - The event object containing the message data from the WebView.
   *
   * The function parses the message data and logs it. Depending on the status of the response,
   * it updates the login text and error message or saves the client key and secret to the secure key store.
   * If the response indicates a successful login, it initiates the OAuth flow and sets the endpoint URL.
   */
  const onMessage = (event: WebViewMessageEvent) => {
    const response: CustomResponse = JSON.parse(event.nativeEvent.data);
    console.log('Received message from webview:', response);
    if (response?.status == StatusType.ERROR) {
      setLoginText('Login');
      setLoginError(response.message);
    }
    if (
      response.status == StatusType.SUCCESS &&
      response?.data?.key &&
      response?.data?.secret
    ) {
      SecureKeyStore.saveKey(CustomKeyType.CLIENT_KEY, response.data.key);
      SecureKeyStore.saveKey(CustomKeyType.CLIENT_SECRET, response.data.secret);
      setLoginText('Setting up Oauth');
      initiateOAuthFlow().then((authUrl) => {
        if (authUrl) {
          setEndpoint(authUrl);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter Username"
        style={styles.input}
      />
      <Text style={styles.inputLabel}>Password:</Text>
      <TextInput
        value={password}
        textContentType="password"
        onChangeText={setPassword}
        placeholder="Enter Password"
        style={styles.input}
        secureTextEntry={true}
      />
      <Text style={styles.inputLabel}>Pin:</Text>
      <TextInput
        value={pin}
        textContentType="password"
        onChangeText={setPin}
        placeholder="Enter Pin"
        style={styles.input}
        secureTextEntry={true}
      />
      {loginError.length > 0 && (
        <Text style={styles.errorMessage}>{loginError}</Text>
      )}
      <Button title={loginText} onPress={handleLogin} />
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
          onMessage={onMessage}
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '85%',
    display: 'flex',
    gap: 10,
  },
  webview: {
    position: 'absolute',
    display: 'none',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
});

export default Login;
