import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import { CustomKeyType } from '@/types/types';
import { openBrowserAsync } from 'expo-web-browser';

interface TermsAndConditionsProps {
  setHasAcceptedTerms: (value: boolean) => void;
}

/**
 * TermsAndConditions component renders the terms and conditions text and provides
 * an option for the user to accept them. Once accepted, it saves the acceptance
 * status in a secure key store and updates the parent component's state.
 *
 * @param {TermsAndConditionsProps} props - The props for the component.
 * @param {Function} props.setHasAcceptedTerms - Function to update the acceptance status in the parent component.
 * @returns {JSX.Element} The rendered component.
 */
const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  setHasAcceptedTerms,
}) => {
  /**
   * Handles the acceptance of terms and conditions.
   * Saves the acceptance status in the secure key store and updates the parent component's state.
   */
  const acceptTerms = () => {
    // Save the acceptance status in the secure key store
    SecureKeyStore.saveKey(CustomKeyType.HAS_ACCEPTED_TERMS, 'true');
    // Update the parent component's state
    setHasAcceptedTerms(true);
  };

  // Opens the AGPL 3.0 License link in the browser
  const openLicenseLink = () => {
    openBrowserAsync('https://www.gnu.org/licenses/agpl-3.0.html');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.content}>
        This app is licensed under the AGPL 3.0 License. By using this app, you
        agree to comply with the terms and conditions of the AGPL 3.0 License.
      </Text>
      <TouchableOpacity onPress={openLicenseLink}>
        <Text style={styles.link}>Read the AGPL 3.0 License</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button title="Accept" onPress={acceptTerms} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  link: {
    fontSize: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
});

export default TermsAndConditions;
