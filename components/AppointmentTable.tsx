import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

/**
 * Column configuration type.
 * @interface {Object} ColumnConfig
 * @property {string} header - The header text for the column.
 * @property {string} accessor - The key to access the data in the item.
 * @property {(item: any) => React.ReactNode} [render] - Optional render function for custom rendering.
 */
interface ColumnConfig {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
}

/**
 * Props for the AppointmentTable component.
 * @interface {Object} TableProps
 * @property {ColumnConfig[]} columns - Array of column configurations.
 * @property {any[]} upcoming - Array of upcoming appointments.
 * @property {any[]} past - Array of past appointments.
 * @property {(item: any) => string} keyExtractor - Function to extract a unique key for each item.
 * @property {(item: any) => void} [onPress] - Optional function to handle item press.
 */
interface TableProps {
  columns: ColumnConfig[];
  upcoming: any[];
  past: any[];
  keyExtractor: (item: any) => string;
  onPress?: (item: any) => void;
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
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onPress && onPress(item)}>
                    <View style={styles.row}>
                      {columns.map((column) => (
                        <Text key={column.accessor} style={styles.itemText}>
                          {column.render
                            ? column.render(item)
                            : item[column.accessor]}
                        </Text>
                      ))}
                      <Ionicons size={20} name="chevron-forward-outline" />
                    </View>
                  </TouchableOpacity>
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
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onPress && onPress(item)}>
                    <View style={styles.row}>
                      {columns.map((column) => (
                        <Text key={column.accessor} style={styles.itemText}>
                          {column.render
                            ? column.render(item)
                            : item[column.accessor]}
                        </Text>
                      ))}
                      <Ionicons size={20} name="chevron-forward-outline" />
                    </View>
                  </TouchableOpacity>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
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
});

export default AppointmentTable;
