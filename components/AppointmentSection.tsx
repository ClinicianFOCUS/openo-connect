import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppointmentTable from './AppointmentTable';
import { Appointment, ColumnConfig } from '@/types/types';

interface AppointmentSectionProps {
  title: string;
  appointments: Appointment[];
  columns: ColumnConfig[];
}

const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  title,
  appointments,
  columns,
}) => (
  <View style={styles.table}>
    <Text style={styles.title}>{title}</Text>
    {!appointments || appointments.length === 0 ? (
      <Text style={styles.noAppointmentsText}>
        No {title.toLowerCase()} found.
      </Text>
    ) : (
      <AppointmentTable
        columns={columns}
        appointments={appointments}
        keyExtractor={(item) => item.id.toString()}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noAppointmentsText: {
    fontSize: 16,
  },
  table: {
    maxHeight: '42%',
  },
});

export default AppointmentSection;
