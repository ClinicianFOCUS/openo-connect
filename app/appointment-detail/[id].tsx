import CameraComponent from "@/components/CameraComponent";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";

const AppointmentDetail = () => {
  const [showCamera, setShowCamera] = useState(false);
  const { id } = useLocalSearchParams();

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
