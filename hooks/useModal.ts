import { useNavigation } from 'expo-router';
import { useState } from 'react';

/**
 * Custom hook to manage modal visibility and navigation.
 *
 * @returns {Object} An object containing:
 * - modalVisible: A boolean indicating if the modal is visible.
 * - setModalVisible: A function to update the modal visibility.
 * - navigation: The navigation object from 'expo-router'.
 */
const useModal = () => {
  // State to manage the visibility of the modal
  const [modalVisible, setModalVisible] = useState(false);

  // Navigation object from 'expo-router'
  const navigation = useNavigation();

  return { modalVisible, setModalVisible, navigation };
};

export default useModal;
