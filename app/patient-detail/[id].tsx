import CameraComponent from "@/components/CameraComponent";
import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

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
    <View style={{ flex: 1 }}>
      {showCamera ? (
        <View style={{ flex: 1 }}>
          <CameraComponent
            demographicNo={parseInt(Array.isArray(id) ? id[0] : id)}
            providerNo="999998"
          />
          <View>
            <Button title="Close Camera" onPress={() => setShowCamera(false)} />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {patientDetail ? (
            <>
              <Text>Patient Detail</Text>
              <Text>
                Name: {patientDetail.firstName} {patientDetail.lastName}
              </Text>
              <Text>
                Date of Birth: {patientDetail.dobYear}-{patientDetail.dobMonth}-
                {patientDetail.dobDay}
              </Text>
              <Text>
                Address: {patientDetail.address.address},{" "}
                {patientDetail.address.city}, {patientDetail.address.province}{" "}
                {patientDetail.address.postal}
              </Text>
              <Text>Phone: {patientDetail.phone}</Text>
              <Text>Email: {patientDetail.email}</Text>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
          <Button title="Open Camera" onPress={() => setShowCamera(true)} />
        </View>
      )}
    </View>
  );
};

export default AppointmentDetail;
