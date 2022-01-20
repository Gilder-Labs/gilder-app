import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

// 1. Fetch selected realms tokens
// 2. Render token list - with monetary value
// At top display total value

export default function VaultScreen({
  navigation,
}: RootTabScreenProps<"Vault">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vault</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
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
