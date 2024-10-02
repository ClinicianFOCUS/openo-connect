import { useOAuth } from "@/hooks/useAuth";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

type Appointment = {
  demographicNo: number;
  appointmentNo: number;
  name: string;
  status: string;
  startTime: string;
  reason: string;
  duration: string;
  type: string;
  notes: string;
  date: string;
};

const AppointmentList = () => {
  const { callApi } = useOAuth();
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    callApi("GET", "schedule/day/today").then((appointmentList) => {
      setAppointments(appointmentList);
      setLoading(false);
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
        <View>
          <View style={styles.header}>
            <Text style={styles.titleText}>Name</Text>
            <Text style={styles.titleText}>Time</Text>
            <Text style={styles.titleText}>Duration</Text>
          </View>
          <FlatList
            data={appointments}
            renderItem={({ item }) => (
              <View style={styles.header}>
                <Link style={styles.itemText} href={"/appointment-detail"}>
                  {item.name}
                </Link>
                <Text style={styles.itemText}>{item.startTime}</Text>
                <Text style={styles.itemText}>{item.duration}</Text>
              </View>
            )}
            keyExtractor={(item) => item.appointmentNo.toString()}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => fetchAppointments()}
              />
            }
          />
        </View>
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
