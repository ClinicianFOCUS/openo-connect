import { Text } from 'react-native';
import infoStyles from './info.styles';

const PatientAppointmentHistoryInfo = () => {
  return (
    <>
      <Text style={infoStyles.paragraph}>
        This screen displays the list of appointments scheduled today. You can
        view the details of each patient by clicking on the appointment.
      </Text>
      <Text style={infoStyles.title}>
        Note: Upcoming appointments are displayed first in order of time. All
        the completed appointments are displayed at the end of the list.
      </Text>
    </>
  );
};

export default PatientAppointmentHistoryInfo;
