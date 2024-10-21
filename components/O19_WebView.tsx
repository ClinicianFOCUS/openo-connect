import {
  FILL_LOGIN_FORM_AND_SUBMIT,
  SEND_GET_REQUEST,
  INJECT_JQUERY,
  AUTHORIZE_OAUTH,
} from '@/scripts/scripts';
import OAuthManager from '@/services/OAuthManager';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { CustomKeyType, CustomResponse, StatusType } from '@/types/types';
import { constructUrl } from '@/utils/utils';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import React, { createRef, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';

interface O19WebViewProps {
  setError: (error: string) => void;
  setButtonText: (text: string) => void;
  initialButtonText: string;
}

const O19WebView: React.FC<O19WebViewProps> = ({
  setError,
  setButtonText,
  initialButtonText,
}) => {
  const [endpoint, setEndpoint] = useState<string>();
  const [providerNo, setProviderNo] = useState<string>();
  const [loginAttempt, setLoginAttempt] = useState<number>(0);
  const [webViewKey, setWebViewKey] = useState(0);

  const { setManager, setHasUserCredentials } = useAuthManagerStore();
  const webViewRef = createRef<WebView>();

  const username = SecureKeyStore.getKey(CustomKeyType.USERNAME);
  const password = SecureKeyStore.getKey(CustomKeyType.PASSWORD);
  const pin = SecureKeyStore.getKey(CustomKeyType.PIN);

  /**
   * 1. Sends a request to the login service to get the provider number.
   * 2. Parses the XML response to extract the provider number.
   * 3. Updates the provider number, endpoint, and other state variables upon successful login.
   * 4. Handles login failure by deleting the saved keys and updating the login error message.
   */
  useEffect(() => {
    getProviderNumber(constructUrl('/ws/LoginService'))
      .then((response) => {
        const parser = new XMLParser();
        let obj = parser.parse(response.data);
        const { providerNo } =
          obj['soap:Envelope']['soap:Body']['ns2:login2Response'].return
            .provider;
        setProviderNo(providerNo);
        setEndpoint(constructUrl('/index.jsp'));
        setLoginAttempt(0);
        setWebViewKey((prevKey) => prevKey + 1);
      })
      .catch(() => {
        SecureKeyStore.deleteKey(CustomKeyType.USERNAME);
        SecureKeyStore.deleteKey(CustomKeyType.PASSWORD);
        SecureKeyStore.deleteKey(CustomKeyType.PIN);
        setHasUserCredentials(false);
        setError('Failed to login. Please try again.');
        setButtonText(initialButtonText);
      });
  }, []);

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
        return manager.getAuthorizationUrl();
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

    const { url } = navigationState;

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
      setError('Failed to login. Please try again.');
      setButtonText(initialButtonText);
    }

    // If webview is on login.do, then the account is locked
    if (url.includes('oscar/login.do')) {
      SecureKeyStore.deleteKey(CustomKeyType.USERNAME);
      SecureKeyStore.deleteKey(CustomKeyType.PASSWORD);
      SecureKeyStore.deleteKey(CustomKeyType.PIN);
      setHasUserCredentials(false);
      setError(
        'Your account has been locked. Please contact an administrator.'
      );
      setButtonText(initialButtonText);
    }

    // If the URL is not the login page (oscar/index.jsp) or login.do or oauth/authorize, inject query to get/set client key and secret
    if (url.includes('oscar/provider')) {
      console.log('INJECTING QUERY TO GET KEY');
      setButtonText('Getting Key');
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
    // If the response is an error, update the login text and error message
    if (response?.status == StatusType.ERROR) {
      setButtonText(initialButtonText);
      setError(response.message);
    }
    // If the response is a success, update the login text and error message
    if (
      response.status == StatusType.SUCCESS &&
      response?.data?.key &&
      response?.data?.secret
    ) {
      SecureKeyStore.saveKey(CustomKeyType.CLIENT_KEY, response.data.key);
      SecureKeyStore.saveKey(CustomKeyType.CLIENT_SECRET, response.data.secret);
      setButtonText('Setting up Oauth');
      initiateOAuthFlow().then((authUrl) => {
        if (authUrl) {
          setEndpoint(authUrl);
        }
      });
    }
  };
  return (
    endpoint && (
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
    )
  );
};

const styles = StyleSheet.create({
  webview: {
    position: 'absolute',
    display: 'none',
  },
});

export default O19WebView;
