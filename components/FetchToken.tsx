import React, { useState } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import O19WebView from './O19_WebView';

/**
 * FetchToken component is responsible for rendering a button that, when pressed,
 * initiates the process of fetching an access token. It manages the button text
 * and error state, and conditionally renders the O19WebView component based on
 * the button's state.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const FetchToken = () => {
  const [buttonText, setButtonText] = useState<string>('Fetch Access Token');
  const [error, setError] = useState<string>('');

  return (
    <View style={styles.center}>
      <View style={styles.container}>
        {/* Display a message prompting the user to refetch the token */}
        <Text style={styles.message}>
          Token expired or settings have been changed. Please refetch token.
        </Text>

        {/* Button to initiate the token fetching process */}
        <Button
          title={buttonText}
          onPress={() => setButtonText('Fetching Token')}
          disabled={buttonText != 'Fetch Access Token'}
        />

        {/* Display an error message if there is an error */}
        {error.length > 0 && <Text style={styles.errorMessage}>{error}</Text>}

        {/* Conditionally render the O19WebView component if the button text is not 'Fetch Access Token' */}
        {buttonText != 'Fetch Access Token' && (
          <O19WebView
            initialButtonText="Fetch Access Token"
            setError={setError}
            setButtonText={setButtonText}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '60%',
    display: 'flex',
  },
  webview: {
    position: 'absolute',
    display: 'none',
  },
  message: {
    marginBottom: 10,
    fontSize: 14,
  },
  errorMessage: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
  },
});

export default FetchToken;
