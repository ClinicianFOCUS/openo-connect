import { StyleSheet, Text } from 'react-native';

const HomeInfo = () => {
  return (
    <>
      <Text style={styles.paragraph}>
        This screen displays the list of appointments scheduled today. You can
        view the details of each patient by clicking on the appointment.
      </Text>
      <Text style={styles.title}>
        Note: Upcoming appointments are displayed first in order of time. All
        the completed appointments are displayed at the end of the list.
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  paragraph: {
    marginBottom: 10,
    color: '#666',
    lineHeight: 22,
  },
});

export default HomeInfo;
