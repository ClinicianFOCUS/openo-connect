import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, Button } from 'react-native';

interface WelcomeScreenProps {
  onNext: () => void;
}

/**
 * WelcomeScreen component displays a welcome message and an overview of the Open-O-Connect app's features.
 *
 * @component
 * @param {WelcomeScreenProps} props - The props for the WelcomeScreen component.
 * @param {function} props.onNext - Callback function to be called when the "Next" button is pressed.
 *
 * @returns {JSX.Element} The rendered WelcomeScreen component.
 *
 * @example
 * <WelcomeScreen onNext={handleNext} />
 *
 * @remarks
 * This screen provides an introduction to the app and lists the main features available to the user.
 * It also includes a note about the info button available on each screen for additional help.
 */
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Open-O-Connect</Text>
      <Text style={styles.description}>
        Open-O-Connect is a mobile app that integrates with O19, making it
        easier for users to access O19's functions on their cell phones. Our
        current features include:
      </Text>
      <View style={styles.featuresList}>
        <Text style={styles.feature}>1. View today's appointments</Text>
        <Text style={styles.feature}>
          2. Access patient information and their appointment history
        </Text>
        <Text style={styles.feature}>
          3. Upload pictures to patient demographics
        </Text>
      </View>
      <Text style={styles.note}>
        On each screen, there is an info button in the top right corner. Use
        this button to get information about the current screen's functionality.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Next" onPress={onNext} />
      </View>
    </SafeAreaView>
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
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 22,
  },
  featuresList: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  feature: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
});

export default WelcomeScreen;
