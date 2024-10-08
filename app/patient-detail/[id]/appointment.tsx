/**
 * Component to display appointment details for a patient.
 */
import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { StatusType } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";

/**
 * Appointment component.
 * @returns {JSX.Element} The rendered component.
 */
const Appointment = () => {
  const [appointmentStatuses, setAppointmentStatuses] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { manager } = useAuthManagerStore();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!manager) return;
    fetchData();
  }, []);

  /**
   * Fetches appointment history and statuses.
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentHistoryRes, appointmentStatusesRes] = await Promise.all(
        [
          manager?.makeAuthorizedRequest(
            "POST",
            `schedule/${id}/appointmentHistory`
          ),
          manager?.makeAuthorizedRequest("GET", `schedule/statuses`),
        ]
      );

      if (
        appointmentHistoryRes &&
        appointmentHistoryRes.status === StatusType.SUCCESS
      ) {
        splitAppointments(appointmentHistoryRes.data.appointments);
      }

      if (
        appointmentStatusesRes &&
        appointmentStatusesRes.status === StatusType.SUCCESS
      ) {
        setAppointmentStatuses(appointmentStatusesRes.data.content);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Splits the appointment history into past and upcoming appointments.
   *
   * @param {Array} appointmentHistory - The list of appointments to be split.
   * @returns {void}
   *
   * The function categorizes appointments based on their date and time.
   * Past appointments are those with a date and time earlier than the current date and time.
   * Upcoming appointments are those with a date and time later than the current date and time.
   *
   * The upcoming appointments are sorted in ascending order by date and time.
   *
   * The function updates the state with the categorized appointments using `setPastAppointments` and `setUpcomingAppointments`.
   */
  const splitAppointments = (appointmentHistory) => {
    const pastAppointments = [];
    const upcomingAppointments = [];

    appointmentHistory.forEach((appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.appointmentDate} ${appointment.startTime}`
      );
      if (appointmentDateTime < new Date()) {
        pastAppointments.push(appointment);
      } else {
        upcomingAppointments.push(appointment);
      }
    });

    // Sort upcoming appointments by date and time in descending order
    upcomingAppointments.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate} ${a.startTime}`);
      const dateB = new Date(`${b.appointmentDate} ${b.startTime}`);
      return dateA - dateB;
    });

    setPastAppointments(pastAppointments);
    setUpcomingAppointments(upcomingAppointments);
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
    <View style={styles.detailContainer}>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 20 }}>
          Appointment History
        </Text>
        <View>
          <Button title="Refresh" onPress={fetchData} />
        </View>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : (
        <View>
          {!upcomingAppointments || upcomingAppointments.length == 0 ? (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.title}>Upcoming Appointment</Text>
              <Text style={{ fontSize: 16 }}>
                No upcoming appointments found.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>Upcoming Appointment</Text>
              <View style={styles.header}>
                <Text style={styles.titleText}>Date</Text>
                <Text style={styles.titleText}>Time</Text>
                <Text style={styles.titleText}>Status</Text>
              </View>
              <FlatList
                style={{ marginBottom: 16 }}
                data={upcomingAppointments}
                renderItem={({ item }) => (
                  <View style={styles.header}>
                    <Text style={styles.itemText}>{item.appointmentDate}</Text>
                    <Text style={styles.itemText}>{item.startTime}</Text>
                    <Text style={styles.itemText}>
                      {getStatusFromCode(item.status)}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}
          {!pastAppointments || pastAppointments.length == 0 ? (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.title}>Past Appointment</Text>
              <Text style={{ fontSize: 16 }}>No past appointments found.</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>Past Appointment</Text>
              <View style={styles.header}>
                <Text style={styles.titleText}>Date</Text>
                <Text style={styles.titleText}>Time</Text>
                <Text style={styles.titleText}>Status</Text>
              </View>
              <FlatList
                data={pastAppointments}
                renderItem={({ item }) => (
                  <View style={styles.header}>
                    <Text style={styles.itemText}>{item.appointmentDate}</Text>
                    <Text style={styles.itemText}>{item.startTime}</Text>
                    <Text style={styles.itemText}>
                      {getStatusFromCode(item.status)}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  titleText: {
    textAlign: "center",
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
  },
  itemText: {
    textAlign: "center",
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
});

export default Appointment;
