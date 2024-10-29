import { Appointment, StatusType } from '@/types/types';
import { splitAppointments } from '@/utils/utils';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AppointmentTable from './AppointmentTable';
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import RNDateTimePicker from '@react-native-community/datetimepicker';

/**
 * AppointmentList component displays a list of today's appointments.
 * It fetches the appointments from an API and splits them into past and upcoming appointments.
 * It also provides a refresh button to re-fetch the appointments.
 */
const AppointmentList = () => {
  const { manager } = useAuthManagerStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState(false);

  const { setHasAccessToken } = useAuthManagerStore();
  const router = useRouter();

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, [manager, date]);

  /**
   * Fetches today's appointments from the API and updates the state.
   */
  const fetchAppointments = () => {
    // Check if the manager is available before fetching appointments
    if (!manager) {
      return;
    }

    setLoading(true);
    const formattedDate = date.toISOString().split('T')[0];
    manager
      .makeAuthorizedRequest('GET', `schedule/day/${formattedDate}`)
      .then((res) => {
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
  /**
   * Enum for date navigation direction.
   */
  enum DateDirection {
    PREV = -1,
    NEXT = 1,
  }

  /**
   * Navigates the date by adding or subtracting days based on the direction.
   * @param direction - The direction to navigate the date (previous or next).
   */
  const navigateDate = (direction: DateDirection) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + direction);
      return newDate;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header section with title and refresh button */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Appointments</Text>
        <TouchableOpacity
          onPress={fetchAppointments}
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.dateSelectorContainer}>
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => navigateDate(DateDirection.PREV)}>
            <Ionicons name="chevron-back-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectDate(true)}>
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateDate(DateDirection.NEXT)}>
            <Ionicons name="chevron-forward-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setDate(new Date())}>
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>
      {/* Loading indicator or appointment table based on loading state */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
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
      {selectDate && (
        <RNDateTimePicker
          value={date}
          onChange={(event, selectedDate) => {
            if (event.type == 'set' && selectedDate) {
              setDate(selectedDate);
            }
            setSelectDate(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 8,
  },
  dateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  todayText: {
    fontSize: 16,
    color: '#007bff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppointmentList;
