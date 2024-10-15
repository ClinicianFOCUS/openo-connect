import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { CustomKeyType, CustomResponse, StatusType } from '@/types/types';
import axios from 'axios';
import Constants from 'expo-constants';
import { useNavigation } from 'expo-router';
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

/**
 * O19Login component handles the OAuth login flow using a WebView.
 * It initiates the OAuth flow, injects jQuery into the WebView, and manages loading states.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const O19Login = () => {
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
  const navigation = useNavigation();

  const BASE_URL = SecureKeyStore.getKey(CustomKeyType.O19_BASE_URL);
  const CALLBACK_URL = Constants.experienceUrl;
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
          { text: 'Go Back', onPress: () => navigation.goBack() },
        ]);
      }
    }
  };

  // SOAP request to get provider number
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

  // jQuery injection script
  const injectJQuery = `
    (function() {
      var script = document.createElement('script');
      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
      script.type = 'text/javascript';
      document.head.appendChild(script);
    })();
    true; // returning true to indicate script has been injected
  `;

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    if (navigationState.loading) {
      return;
    }
    const url = navigationState.url;

    // Inject login credentials if the URL is the login page (oscar/index.jsp)
    if (
      webViewRef.current &&
      url.includes('oscar/index.jsp') &&
      loginAttempt == 0
    ) {
      console.log('INJECTING FILLED FORM');
      webViewRef.current.injectJavaScript(FILL_LOGIN_FORM_AND_SUBMIT);
      setLoginAttempt(loginAttempt + 1);
    }

    if (!webViewRef.current) {
      return;
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
    if (
      !url.includes('oscar/index.jsp') &&
      !url.includes('oscar/login.do') &&
      !url.includes('oauth/authorize')
    ) {
      console.log('INJECTING QUERY TO GET KEY');
      setLoginText('Getting Key');
      webViewRef.current.injectJavaScript(SEND_GET_REQUEST);
    }

    if (url.includes('oauth/authorize')) {
      console.log('Injecting JQuery');
      webViewRef.current.injectJavaScript(injectJQuery);
      webViewRef.current.injectJavaScript(AUTHORIZE_OAUTH);
    }
  };

  //Query to fill the form and submit
  const FILL_LOGIN_FORM_AND_SUBMIT = `
    (function() {
      document.getElementById('username').value = '${username}';
      document.getElementById('password2').value = '${password}';
      document.getElementById('pin').value = '${pin}';
      document.getElementById('pin2').value = '${pin}';
      let submitButton = document.querySelector('button[type="submit"][name="submit"].btn.btn-primary.btn-block');
      if (submitButton) {
        submitButton.click();
      } else {
        console.error('Submit button not found');
      }
    })();
    true`;

  //Query to get or set the client key and secret
  const SEND_GET_REQUEST = `
   function CREATE_CLIENT() {
    fetch('${BASE_URL}/admin/api/clientManage.json?method=add&name=${providerNo}&uri=${CALLBACK_URL}&lifetime=86400')
      .then((response) => response.json())
      .then((data) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.SUCCESS}", message: "Key created successfully" }));
        GET_CLIENT();
      })
      .catch(error => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.ERROR}", message: "Failed to create key" }));
      })
  }
  function GET_CLIENT() {
    let keyFound = null;
    fetch('${BASE_URL}/admin/api/clientManage.json?method=list')
      .then((response) => response.json())
      .then((data) => {
        keyFound = data.find((item) => item.name === '${providerNo}');

        if (!keyFound) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.SUCCESS}", message: "Key not found. Creating Key" }));
          CREATE_CLIENT();
          return;
        }
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.SUCCESS}", data : { key: keyFound.key, secret: keyFound.secret } }));
      })
      .catch((error) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.ERROR}", message: "Failed to get key. Trying again" }));
      });
  }
  GET_CLIENT();
  true;
  `;

  const AUTHORIZE_OAUTH = `
    (function() {
      let authorizeButton = document.querySelector('input[type="submit"].btn.btn-primary');
      if (authorizeButton) {
        authorizeButton.click();
      } else {
        console.error('Submit button not found');
      }
    })();
    true`;

  const handleLogin = () => {
    setLoginText('Logging in...');
    SecureKeyStore.saveKey(CustomKeyType.USERNAME, username);
    SecureKeyStore.saveKey(CustomKeyType.PASSWORD, password);
    SecureKeyStore.saveKey(CustomKeyType.PIN, pin);
    getProviderNumber(`${BASE_URL}/ws/LoginService`)
      .then((response) => {
        const parser = new XMLParser();
        let obj = parser.parse(response.data);
        const providerNo =
          obj['soap:Envelope']['soap:Body']['ns2:login2Response'].return
            .provider.providerNo;
        setProviderNo(providerNo);
        setEndpoint(`${BASE_URL}/index.jsp`);
        setLoginError('');
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
    padding: 20,
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

export default O19Login;
