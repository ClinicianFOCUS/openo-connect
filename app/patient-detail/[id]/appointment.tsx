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
} from "react-native";

const Appointment = () => {
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { manager } = useAuthManagerStore();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!manager) return;
    fetchData();
  }, []);

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
        setAppointmentHistory(appointmentHistoryRes.data.appointments);
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

  const ShowAppointmentHistory = () => {
    if (!appointmentHistory || appointmentHistory.length === 0)
      return (
        <View>
          <Text style={styles.title}>Appointment History</Text>
          <Text style={{ fontSize: 16 }}>No appointment history found </Text>
        </View>
      );
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
    return (
      <View>
        <Text style={styles.title}>Upcoming Appointment</Text>
        <View style={styles.header}>
          <Text style={styles.titleText}>Date</Text>
          <Text style={styles.titleText}>Time</Text>
          <Text style={styles.titleText}>Status</Text>
        </View>
        <FlatList
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
    );
  };

  const getStatusFromCode = (status: string): string => {
    const statusFound = appointmentStatuses.find(
      (item) => item.status === status
    );
    return statusFound ? statusFound.description : status;
  };
  return (
    <View style={styles.detailContainer}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : (
        ShowAppointmentHistory()
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
    backgroundColor: "#fff",
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
