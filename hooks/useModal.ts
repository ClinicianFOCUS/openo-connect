import { useState } from 'react';

const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return { modalVisible, setModalVisible };
};

export default useModal;
