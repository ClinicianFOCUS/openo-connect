import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

/**
 * Column configuration type.
 * @typedef {Object} ColumnConfig
 * @property {string} header - The header text for the column.
 * @property {string} accessor - The key to access the data in the item.
 * @property {(item: any) => React.ReactNode} [render] - Optional render function for custom rendering.
 */
type ColumnConfig = {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
};

/**
 * Props for the AppointmentTable component.
 * @typedef {Object} TableProps
 * @property {ColumnConfig[]} columns - Array of column configurations.
 * @property {any[]} upcoming - Array of upcoming appointments.
 * @property {any[]} past - Array of past appointments.
 * @property {(item: any) => string} keyExtractor - Function to extract a unique key for each item.
 */
type TableProps = {
  columns: ColumnConfig[];
  upcoming: any[];
  past: any[];
  keyExtractor: (item: any) => string;
};

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
            <FlatList
              data={upcoming}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  {columns.map((column) => (
                    <Text key={column.accessor} style={styles.itemText}>
                      {column.render
                        ? column.render(item)
                        : item[column.accessor]}
                    </Text>
                  ))}
                </View>
              )}
              keyExtractor={keyExtractor}
            />
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
            <FlatList
              data={past}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  {columns.map((column) => (
                    <Text key={column.accessor} style={styles.itemText}>
                      {column.render
                        ? column.render(item)
                        : item[column.accessor]}
                    </Text>
                  ))}
                </View>
              )}
              keyExtractor={keyExtractor}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default AppointmentTable;
