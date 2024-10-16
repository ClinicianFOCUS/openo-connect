import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AppointmentRow from './AppointmentRow';
import { Appointment, ColumnConfig } from '@/types/types';

/**
 * Props for the AppointmentTable component.
 * @interface {Object} TableProps
 * @property {ColumnConfig[]} columns - Array of column configurations.
 * @property {Appointment[]} upcoming - Array of upcoming appointments.
 * @property {Appointment[]} past - Array of past appointments.
 * @property {(item: Appointment) => string} keyExtractor - Function to extract a unique key for each item.
 * @property {(item: Appointment) => void} [onPress] - Optional function to handle item press.
 */
interface TableProps {
  columns: ColumnConfig[];
  upcoming: Appointment[];
  past: Appointment[];
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
  upcoming,
  past,
  keyExtractor,
  onPress,
}) => {
  return (
    <View>
      {/* Render upcoming appointments section */}
      {!upcoming || upcoming.length == 0 ? (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.title}>Upcoming Appointment</Text>
          <Text style={{ fontSize: 16 }}>No upcoming appointments found.</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Upcoming Appointment</Text>
          <View>
            <View style={styles.header}>
              {columns.map((column) => (
                <Text key={column.accessor} style={styles.titleText}>
                  {column.header}
                </Text>
              ))}
            </View>
            <View style={{ maxHeight: 150 }}>
              <FlatList
                data={upcoming}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                persistentScrollbar={true}
                renderItem={({ item }) => (
                  <AppointmentRow
                    item={item}
                    columns={columns}
                    onPress={onPress}
                  />
                )}
                keyExtractor={keyExtractor}
              />
            </View>
          </View>
        </View>
      )}
      {/* Render past appointments section */}
      {!past || past.length == 0 ? (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.title}>Past Appointment</Text>
          <Text style={{ fontSize: 16 }}>No past appointments found.</Text>
        </View>
      ) : (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.title}>Past Appointment</Text>
          <View>
            <View style={styles.header}>
              {columns.map((column) => (
                <Text key={column.accessor} style={styles.titleText}>
                  {column.header}
                </Text>
              ))}
            </View>
            <View style={{ maxHeight: 150 }}>
              <FlatList
                data={past}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                persistentScrollbar={true}
                renderItem={({ item }) => (
                  <AppointmentRow
                    item={item}
                    columns={columns}
                    onPress={onPress}
                  />
                )}
                keyExtractor={keyExtractor}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#bfbfbf',
    paddingEnd: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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

export default AppointmentTable;
