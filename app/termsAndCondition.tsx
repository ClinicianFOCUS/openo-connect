import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SecureKeyStore } from '@/services/SecureKeyStore';
import { CustomKeyType } from '@/types/types';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.content}>
        {/* Your terms and conditions content here */}
      </Text>
      <Button title="Accept" onPress={acceptTerms} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default TermsAndConditions;
