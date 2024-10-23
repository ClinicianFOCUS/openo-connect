import { Text } from 'react-native';
import infoStyles from './info.styles';

const PatientAppointmentHistoryInfo = () => {
  return (
    <>
      <Text style={infoStyles.paragraph}>
        This screen displays all the upcoming and past appointments of the
        patient.
      </Text>
    </>
  );
};

export default PatientAppointmentHistoryInfo;
