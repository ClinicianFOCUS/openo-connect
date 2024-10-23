import { useNavigation } from 'expo-router';
import { useState } from 'react';

const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  return { modalVisible, setModalVisible, navigation };
};

export default useModal;
