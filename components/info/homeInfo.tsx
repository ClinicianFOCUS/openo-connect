import { Text } from 'react-native';
import infoStyles from './info.styles';

const HomeInfo = () => {
  return (
    <>
      <Text style={infoStyles.paragraph}>
        This screen displays the list of appointments scheduled today. You can
        view the details of each patient by clicking on the appointment.
      </Text>
      <Text style={infoStyles.paragraph}>
        You can select custom dates to view the appointments scheduled on that
        day by clicking on the <Text style={{ fontWeight: 'bold' }}>Date</Text>.
        Pressing the arrow buttons will navigate to the previous or next day.
      </Text>
      <Text style={infoStyles.paragraph}>
        You can quickly navigate to today's appointments by clicking on the{' '}
        <Text style={{ fontWeight: 'bold' }}>Today</Text> button near the{' '}
        <Text style={{ fontWeight: 'bold' }}>Date</Text>.
      </Text>
      <Text style={infoStyles.title}>
        Note: Upcoming appointments are displayed first in order of time. All
        the completed appointments are displayed at the end of the list.
      </Text>
    </>
  );
};

export default HomeInfo;
