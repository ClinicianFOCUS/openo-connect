import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AppointmentRow from './AppointmentRow';
import { Appointment, ColumnConfig } from '@/types/types';

/**
 * Props for the AppointmentTable component.
 * @interface {Object} TableProps
 * @property {ColumnConfig[]} columns - Array of column configurations.
 * @property {Appointment[]} appointment - Array of appointments.
 * @property {(item: Appointment) => string} keyExtractor - Function to extract a unique key for each item.
 * @property {(item: Appointment) => void} [onPress] - Optional function to handle item press.
 */
interface TableProps {
  columns: ColumnConfig[];
  appointments: Appointment[];
  keyExtractor: (item: Appointment) => string;
  onPress?: (item: Appointment) => void;
}

/**
 * AppointmentTable component to display upcoming and past appointments.
 * @param {TableProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const AppointmentTable: React.FC<TableProps> = ({
  columns,
  appointments,
  keyExtractor,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {columns.map((column) => (
          <Text key={column.accessor} style={styles.titleText}>
            {column.header}
          </Text>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={appointments}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          persistentScrollbar={true}
          renderItem={({ item }) => (
            <AppointmentRow item={item} columns={columns} onPress={onPress} />
          )}
          keyExtractor={keyExtractor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#bfbfbf',
    paddingEnd: 20,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 5,
  },
});

export default AppointmentTable;
