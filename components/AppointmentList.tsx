import { useOAuth } from "@/hooks/useAuth";
import { Appointment, StatusType } from "@/types/types";
import { splitAppointments } from "@/utils/utils";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import AppointmentTable from "./AppointmentTable";

const AppointmentList = () => {
  const { callApi } = useOAuth();
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    callApi("GET", "schedule/day/today").then((res) => {
      if (res.status === StatusType.SUCCESS) {
        const { pastAppointments, upcomingAppointments } = splitAppointments(
          res.data
        );
        setPastAppointments(pastAppointments);
        setUpcomingAppointments(upcomingAppointments);
        setLoading(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 20 }}>
          Appointments
        </Text>
        <View>
          <Button title="Refresh" onPress={fetchAppointments} />
        </View>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : (
        <AppointmentTable
          columns={[
            {
              header: "Name",
              accessor: "name",
              render: (item) => (
                <Link href={`/patient-detail/${item.demographicNo}`}>
                  {item.name}
                </Link>
              ),
            },
            {
              header: "Time",
              accessor: "startTime",
            },
            {
              header: "Duration",
              accessor: "duration",
            },
          ]}
          upcoming={upcomingAppointments}
          past={pastAppointments}
          keyExtractor={(item) => item.appointmentNo}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});

export default AppointmentList;
