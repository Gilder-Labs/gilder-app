import { StyleSheet, FlatList } from "react-native";
import { RootTabScreenProps } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import styled from "styled-components/native";
import { VaultCard } from "../components";

export default function TreasuryScreen({
  navigation,
}: RootTabScreenProps<"Treasury">) {
  const { selectedRealm, realmVaults } = useAppSelector(
    (state) => state.realms
  );

  // * list vaults - use public key for name?
  // * onclick vault list tokens in stack?
  // * get token prices
  // * get total treasury prices

  const renderVault = ({ item }: any) => {
    return (
      <VaultCard
        vaultId={item.vaultId}
        tokens={item.tokens}
        key={item.vaultId}
      />
    );
  };

  return (
    <Container>
      <FlatList
        data={realmVaults}
        renderItem={renderVault}
        keyExtractor={(item) => item.vaultId}
        style={{ padding: 16 }}
      />
    </Container>
  );
}

const Title = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 40px;
`;

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[900]};
`;
