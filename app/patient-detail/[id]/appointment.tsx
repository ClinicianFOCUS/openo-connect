/**
 * Component to display appointment details for a patient.
 */
import AppointmentTable from '@/components/AppointmentTable';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { Appointment, AppointmentStatus, StatusType } from '@/types/types';
import { splitAppointments } from '@/utils/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';

/**
 * Appointment component.
 * @returns {JSX.Element} The rendered component.
 */
const PatientAppointment = () => {
  const [appointmentStatuses, setAppointmentStatuses] = useState<
    AppointmentStatus[]
  >([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { manager } = useAuthManagerStore();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!manager) {
      return;
    }
    fetchData();
  }, []);

  /**
   * Fetches appointment history and statuses.
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      //Fetch both history and statuses concurrently
      const [appointmentHistoryRes, appointmentStatusesRes] = await Promise.all(
        [
          manager?.makeAuthorizedRequest(
            'POST',
            `schedule/${id}/appointmentHistory`
          ),
          manager?.makeAuthorizedRequest('GET', `schedule/statuses`),
        ]
      );

      if (
        appointmentHistoryRes &&
        appointmentHistoryRes.status === StatusType.SUCCESS
      ) {
        const { pastAppointments, upcomingAppointments } = splitAppointments(
          appointmentHistoryRes.data.appointments
        );
        setPastAppointments(pastAppointments);
        setUpcomingAppointments(upcomingAppointments);
      }

      if (
        appointmentStatusesRes &&
        appointmentStatusesRes.status === StatusType.SUCCESS
      ) {
        setAppointmentStatuses(appointmentStatusesRes.data.content);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  /**
   * Gets the status description from the status code.
   * @param {string} status - The status code.
   * @returns {string} The status description.
   */
  const getStatusFromCode = (status: string): string => {
    const statusFound = appointmentStatuses.find(
      (item) => item.status === status
    );
    return statusFound ? statusFound.description : status;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 20 }}>
          Appointment History
        </Text>
        <View>
          <TouchableOpacity onPress={fetchData}>
            <Ionicons name="refresh" size={36} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : (
        <View
          style={{
            height: '92%',
            display: 'flex',
            gap: 60,
          }}
        >
          {/* Render upcoming appointments section */}
          <View
            style={{
              maxHeight: '42%',
            }}
          >
            <Text style={styles.title}>Upcoming Appointment</Text>
            {!upcomingAppointments || upcomingAppointments.length == 0 ? (
              <Text style={{ fontSize: 16 }}>
                No upcoming appointments found.
              </Text>
            ) : (
              <AppointmentTable
                columns={[
                  {
                    header: 'Date',
                    accessor: 'appointmentDate',
                  },
                  {
                    header: 'Time',
                    accessor: 'startTime',
                  },
                  {
                    header: 'Status',
                    accessor: 'status',
                    render: (item) => getStatusFromCode(item.status),
                  },
                ]}
                appointments={upcomingAppointments}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
          </View>
          {/* Render past appointments section */}
          <View
            style={{
              maxHeight: '42%',
            }}
          >
            <Text style={styles.title}>Past Appointment</Text>
            {!pastAppointments || pastAppointments.length == 0 ? (
              <Text style={{ fontSize: 16 }}>No past appointments found.</Text>
            ) : (
              <AppointmentTable
                columns={[
                  {
                    header: 'Date',
                    accessor: 'appointmentDate',
                  },
                  {
                    header: 'Time',
                    accessor: 'startTime',
                  },
                  {
                    header: 'Status',
                    accessor: 'status',
                    render: (item) => getStatusFromCode(item.status),
                  },
                ]}
                appointments={pastAppointments}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailContainer: {
    padding: 16,
    display: 'flex',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  appointmentSection: {
    flex: 1,
    padding: 16,
  },
  noAppointmentsText: {
    fontSize: 16,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
});

export default PatientAppointment;
