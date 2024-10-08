import CameraComponent from "@/components/CameraComponent";
import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { StatusType } from "@/types/types";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";

const AppointmentDetail = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [patientDetail, setPatientDetail] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { manager } = useAuthManagerStore();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!manager) return;
    fetchData();
  }, [id, manager]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientDetailRes, appointmentHistoryRes, appointmentStatusesRes] =
        await Promise.all([
          manager?.makeAuthorizedRequest("GET", `demographics/basic/${id}`),
          manager?.makeAuthorizedRequest(
            "POST",
            `schedule/${id}/appointmentHistory`
          ),
          manager?.makeAuthorizedRequest("GET", `schedule/statuses`),
        ]);

      if (patientDetailRes && patientDetailRes.status === StatusType.SUCCESS) {
        setPatientDetail(patientDetailRes.data);
      }

      if (
        appointmentHistoryRes &&
        appointmentHistoryRes.status === StatusType.SUCCESS
      ) {
        setAppointmentHistory(appointmentHistoryRes.data.appointments);
        console.log(appointmentHistoryRes.data);
      }

      if (
        appointmentStatusesRes &&
        appointmentStatusesRes.status === StatusType.SUCCESS
      ) {
        setAppointmentStatuses(appointmentStatusesRes.data.content);
        console.log(appointmentStatusesRes.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ShowCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraComponent
          demographicNo={parseInt(Array.isArray(id) ? id[0] : id)}
          providerNo="999998"
        />
        <View style={styles.buttonContainer}>
          <Button title="Close Camera" onPress={() => setShowCamera(false)} />
        </View>
      </View>
    );
  };

  const ShowPatientDetail = () => {
    if (!patientDetail) return null;
    return (
      <View>
        <Text style={styles.title}>Patient Detail</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {patientDetail.firstName} {patientDetail.lastName}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Sex:</Text>
          <Text style={styles.value}>{patientDetail.sex}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>
            {patientDetail.dobYear}-{patientDetail.dobMonth}-
            {patientDetail.dobDay}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{patientDetail.age.years}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>
            {patientDetail.address.address}, {patientDetail.address.city},{" "}
            {patientDetail.address.province} {patientDetail.address.postal}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{patientDetail.phone}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{patientDetail.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Health Insurance:</Text>
          <Text style={styles.value}>{patientDetail.hin}</Text>
        </View>
      </View>
    );
  };

  const ShowAppointmentHistory = () => {
    if (!appointmentHistory || appointmentHistory.length === 0)
      return (
        <View>
          <Text style={styles.title}>Appointment History</Text>
          <Text style={{ fontSize: 16 }}>No appointment history found </Text>
        </View>
      );
    return (
      <View>
        <Text style={styles.title}>Appointment History</Text>
        <View style={styles.header}>
          <Text style={styles.titleText}>Date</Text>
          <Text style={styles.titleText}>Time</Text>
          <Text style={styles.titleText}>Status</Text>
        </View>
        <FlatList
          data={appointmentHistory}
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
    <View style={styles.container}>
      {showCamera ? (
        ShowCamera()
      ) : (
        <View style={styles.detailContainer}>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size={70} color="#0000ff" />
            </View>
          ) : (
            <View>
              {ShowPatientDetail()}
              {ShowAppointmentHistory()}
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button title="Open Camera" onPress={() => setShowCamera(true)} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
  },
  value: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 24,
  },
  buttonContainer: {
    marginTop: 16,
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

export default AppointmentDetail;
