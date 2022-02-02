import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmTokens } from "../store/realmSlice";
import { TokenList } from "../components";
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

  return (
    <Container>
      <Title>{selectedRealm?.name}</Title>

      <TokenList tokens={realmTokens} />
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </Container>
  );
}

const Title = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
`;

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[800]};
  padding: ${(props: any) => props.theme.spacing[3]};
`;
