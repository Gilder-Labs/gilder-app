import { StyleSheet } from "react-native";
import { useEffect } from "react";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { ThemeProvider } from "@react-navigation/native";
import * as web3 from "@solana/web3.js";
import { getRealms } from "@solana/spl-governance";

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  // const fetchRealms = async () => {
  //   const programId = new web3.PublicKey(
  //     "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"
  //   );
  //   const rpcEndpoint = "https://api.mainnet-beta.solana.com";

  //   const realms = await getRealms(rpcEndpoint, programId);
  //   console.log("Realms", realms);
  // };

  useEffect(() => {
    // fetchRealms();
  }, []);

  return (
    <StyledContainer>
      <Text style={styles.title}>Activity</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </StyledContainer>
  );
}

const StyledContainer = styled.View`
  background: ${(props) => props.theme.gray[800]};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const styles = StyleSheet.create({
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
