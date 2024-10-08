import CameraComponent from "@/components/CameraComponent";
import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";

const AppointmentDetail = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [patientDetail, setPatientDetail] = useState(null);
  const { manager } = useAuthManagerStore();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!manager) return;
    manager
      ?.makeAuthorizedRequest("GET", `demographics/basic/${id}`)
      .then((res) => {
        setPatientDetail(res.data);
      });
  }, []);

  return (
    <View style={styles.container}>
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraComponent
            demographicNo={parseInt(Array.isArray(id) ? id[0] : id)}
            providerNo="999998"
          />
          <View style={styles.buttonContainer}>
            <Button title="Close Camera" onPress={() => setShowCamera(false)} />
          </View>
        </View>
      ) : (
        <View style={styles.detailContainer}>
          {patientDetail ? (
            <>
              <Text style={styles.title}>Patient Detail</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>
                  {patientDetail.firstName} {patientDetail.lastName}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Date of Birth:</Text>
                <Text style={styles.value}>
                  {patientDetail.dobYear}-{patientDetail.dobMonth}-
                  {patientDetail.dobDay}
                </Text>
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
            </>
          ) : (
            <Text style={styles.loadingText}>Loading...</Text>
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
    padding: 16,
    backgroundColor: "#fff",
  },
  cameraContainer: {
    flex: 1,
  },
  detailContainer: {
    flex: 1,
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
});

export default AppointmentDetail;
