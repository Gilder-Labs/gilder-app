import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmTokens } from "../store/realmSlice";
import { TokenCard } from "../components";
import styled from "styled-components/native";
// 1. Fetch selected realms tokens
// 2. Render token list - with monetary value
// At top display total value

export default function VaultScreen({
  navigation,
}: RootTabScreenProps<"Vault">) {
  const { selectedRealm, realmTokens } = useAppSelector(
    (state) => state.realms
  );
  const dispatch = useAppDispatch();

  console.log("realm tokens", realmTokens);
  return (
    <Container>
      <Text>{selectedRealm?.name}</Text>

      {realmTokens.map((token) => (
        <TokenCard key={token.mint} name={token.mint} />
      ))}
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[800]};
`;
