import { useAppointmentStatus } from '@/hooks/useAppointmentStatus';
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Appointment, ColumnConfig } from '@/types/types';

interface AppointmentRowProps {
  item: Appointment;
  columns: ColumnConfig[];
  onPress?: (item: Appointment) => void;
}

/**
 * A functional component that renders a row for an appointment.
 *
 * @param {AppointmentRowProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
const AppointmentRow: React.FC<AppointmentRowProps> = React.memo(
  ({ item, columns, onPress }) => {
    const { getColorFromStatus, getIconFromStatus } = useAppointmentStatus();

    return (
      <TouchableOpacity
        style={{
          backgroundColor: getColorFromStatus(item.status),
        }}
        onPress={() => onPress && onPress(item)}
      >
        <View style={styles.row}>
          <Image
            source={{ uri: getIconFromStatus(item.status) }}
            style={styles.icon}
          />
          {/* Loop through column to display the values corresponding to it */}
          {columns.map((column) => (
            <Text key={column.accessor} style={styles.itemText}>
              {column.render ? column.render(item) : item[column.accessor]}
            </Text>
          ))}
          <Ionicons size={20} name="chevron-forward-outline" />
        </View>
        <View style={styles.borderBottom}>
          <Text style={[styles.itemText, styles.reasonText]}>
            Reason: {item.reason}
          </Text>
          {/* Display notes if available */}
          {item.notes && (
            <Text style={[styles.itemText, styles.reasonText]}>
              Notes: {item.notes}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
  },
  icon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
  reasonText: {
    textAlign: 'left',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});

export default AppointmentRow;
