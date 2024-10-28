import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

const usePatientName = () => {
  const { patientName } = useAuthManagerStore();

  const navigation = useNavigation();

  // Update the header title with the patient's name. Rerun every time the patientName changes.
  useLayoutEffect(() => {
    if (patientName) {
      navigation.getParent()?.setOptions({
        headerTitle: patientName,
      });
    }
  }, [patientName]);
};

export default usePatientName;
