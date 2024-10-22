import { Appointment, StatusType } from '@/types/types';
import { splitAppointments } from '@/utils/utils';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AppointmentTable from './AppointmentTable';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * AppointmentList component displays a list of today's appointments.
 * It fetches the appointments from an API and splits them into past and upcoming appointments.
 * It also provides a refresh button to re-fetch the appointments.
 */
const AppointmentList = () => {
  const { manager } = useAuthManagerStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const { setHasAccessToken } = useAuthManagerStore();
  const router = useRouter();

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, [manager]);

  /**
   * Fetches today's appointments from the API and updates the state.
   */
  const fetchAppointments = () => {
    // Check if the manager is available before fetching appointments
    if (!manager) {
      return;
    }

    setLoading(true);
    manager.makeAuthorizedRequest('GET', 'schedule/day/today').then((res) => {
      if (res.status === StatusType.SUCCESS) {
        // Split appointments into past and upcoming
        const { pastAppointments, upcomingAppointments } = splitAppointments(
          res.data
        );
        setAppointments(upcomingAppointments.concat(pastAppointments));
        setLoading(false);
      } else {
        // Handle unauthorized access
        if (res?.code == 401) {
          setHasAccessToken(false);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header section with title and refresh button */}
      <View style={styles.header}>
        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 20 }}>
          Today's Appointments
        </Text>
        <View>
          <TouchableOpacity onPress={fetchAppointments}>
            <Ionicons name="refresh" size={36} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Loading indicator or appointment table based on loading state */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : (
        <AppointmentTable
          columns={[
            {
              header: 'Name',
              accessor: 'name',
            },
            {
              header: 'Time',
              accessor: 'startTime',
            },
          ]}
          appointments={appointments}
          keyExtractor={(item) => item.appointmentNo.toString()}
          onPress={(item) =>
            router.push(`/patient-detail/${item.demographicNo}`)
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    maxHeight: '93%',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 1,
  },
  itemText: {
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
  },
});

export default AppointmentList;
