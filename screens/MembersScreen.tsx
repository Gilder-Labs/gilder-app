import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function MembersScreen({
  navigation,
}: RootTabScreenProps<"Members">) {
  // Get members of DAO
  // need to fetch by both councilMint and communityMint

  // const tokenAccounts = await getTokenAccountsByMint(
  //   connection.current,
  //   realm.account.config.councilMint.toBase58()
  // )
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members</Text>
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
