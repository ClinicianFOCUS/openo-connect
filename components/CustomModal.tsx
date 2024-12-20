import React, { useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import useModal from '@/hooks/useModal';

interface CustomModalProps {
  title: string;
  children: React.ReactNode;
}

/**
 * CustomModal component that displays a modal with a title and content.
 * The modal can be opened and closed using the provided hooks and navigation options.
 *
 * @param {CustomModalProps} props - The props for the CustomModal component.
 * @param {string} props.title - The title of the modal.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 * @returns {JSX.Element} The rendered CustomModal component.
 */
const CustomModal: React.FC<CustomModalProps> = ({ title, children }) => {
  const { modalVisible, setModalVisible, navigation } = useModal();

  // Set up the header right button to open the modal when pressed
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerRight: () => (
          <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="information-circle-outline" size={36} />
            </TouchableOpacity>
          </View>
        ),
      });
    }, [])
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTitleView}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          </View>
          {/* Model content goes here */}
          <View style={styles.modalContentView}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitleView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContentView: {
    padding: 15,
  },
});

export default CustomModal;
