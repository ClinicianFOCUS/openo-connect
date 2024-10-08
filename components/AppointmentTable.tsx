import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

type ColumnConfig = {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
};

type TableProps = {
  columns: ColumnConfig[];
  upcoming: any[];
  past: any[];
  keyExtractor: (item: any) => string;
};

const AppointmentTable: React.FC<TableProps> = ({
  columns,
  upcoming,
  past,
  keyExtractor,
}) => {
  return (
    <View>
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
