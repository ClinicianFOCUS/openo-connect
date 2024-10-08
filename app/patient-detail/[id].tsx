import CameraComponent from "@/components/CameraComponent";
import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

const AppointmentDetail = () => {
  const [showCamera, setShowCamera] = useState(false);
  const { manager } = useAuthManagerStore();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!manager) return;
    manager
      ?.makeAuthorizedRequest("GET", `demographics/basic/${id}`)
      .then((res) => {
        console.log(res);
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
          <Text>Appointment Detail </Text>
          <Button title="Open Camera" onPress={() => setShowCamera(true)} />
        </View>
      )}
    </View>
  );
};

export default AppointmentDetail;
