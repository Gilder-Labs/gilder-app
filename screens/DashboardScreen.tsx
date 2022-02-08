import { StyleSheet, Text, View } from "react-native";

import { RootTabScreenProps } from "../types";

export default function DashboardScreen({
  navigation,
}: RootTabScreenProps<"Dashboard">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
