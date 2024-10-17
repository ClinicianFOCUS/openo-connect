/**
 * Component to display patient details.
 */
import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { PatientDetail, StatusType } from '@/types/types';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';

/**
 * AppointmentDetail component.
 * @returns {JSX.Element} The rendered component.
 */
const AppointmentDetail = () => {
  const [patientDetail, setPatientDetail] = useState<PatientDetail>();
  const [loading, setLoading] = useState(true);
  const { manager, setHasAccessToken } = useAuthManagerStore();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    if (!manager) {
      return;
    }
    setLoading(true);
    manager
      ?.makeAuthorizedRequest('GET', `demographics/basic/${id}`)
      .then((res) => {
        if (res.status === StatusType.SUCCESS) {
          setPatientDetail(res.data);
          setLoading(false);
        } else {
          if (res?.code == 401) {
            setHasAccessToken(false);
          }
          Alert.alert(res.message);
        }
      });
  }, [id, manager]);

  useLayoutEffect(() => {
    if (patientDetail) {
      navigation.getParent()?.setOptions({
        headerTitle: `${patientDetail.firstName} ${patientDetail.lastName}`,
      });
    }
  }, [navigation, patientDetail]);

  /**
   * Renders the patient detail.
   * @returns {JSX.Element|null} The rendered patient detail.
   */
  const ShowPatientDetail = () => {
    if (!patientDetail) {
      return null;
    }
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
          <View style={{ display: 'flex', height: 50 }}>
            <Text style={styles.value}>{patientDetail.address.address}</Text>
            <Text style={styles.value}>
              {patientDetail.address.city}, {patientDetail.address.province}{' '}
              {patientDetail.address.postal}
            </Text>
          </View>
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

  return (
    <View style={styles.detailContainer}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={70} color="#0000ff" />
        </View>
      ) : (
        ShowPatientDetail()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  value: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
});

export default AppointmentDetail;
