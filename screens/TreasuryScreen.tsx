import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { TokenList } from "../components";
import styled from "styled-components/native";
// 1. Fetch selected realms tokens
// 2. Render token list - with monetary value
// At top display total value

export default function TreasuryScreen({
  navigation,
}: RootTabScreenProps<"Treasury">) {
  const { selectedRealm, realmVaults } = useAppSelector(
    (state) => state.realms
  );

  return (
    <Container>
      <TokenList tokens={realmVaults[0].tokens} />
    </Container>
  );
}

const Title = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 40px;
`;

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[800]};
  padding: ${(props: any) => props.theme.spacing[4]};
`;
