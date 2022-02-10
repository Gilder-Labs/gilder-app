import { useEffect, useState } from "react";
import { StyleSheet, SectionList, FlatList } from "react-native";
import { RootTabScreenProps } from "../types";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import styled from "styled-components/native";
import { VaultCard } from "../components";
import numeral from "numeral";

export default function TreasuryScreen({
  navigation,
}: RootTabScreenProps<"Treasury">) {
  const { tokenPriceData, realmVaults } = useAppSelector(
    (state) => state.realms
  );
  const [treasuryValue, setTreasuryValue] = useState("0");

  const getTreasuryTotalValue = () => {
    let totalValue = 0;

    realmVaults.forEach((vault) => {
      vault.tokens.forEach((token: any) => {
        const coinGeckoId = token?.extensions?.coingeckoId;
        totalValue +=
          tokenPriceData[coinGeckoId]?.current_price *
            token.tokenAmount.uiAmount || 0;
      });
    });
    return numeral(totalValue).format("$0,0");
  };

  useEffect(() => {
    setTreasuryValue(getTreasuryTotalValue());
  }, [realmVaults]);

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
        style={{ paddingTop: 16, paddingBottom: 16 }}
        ListHeaderComponent={
          <HeaderContainer>
            <TreasuryValueContainer>
              <SubtitleText> Total Balance </SubtitleText>
              <TreasuryText>{treasuryValue}</TreasuryText>
            </TreasuryValueContainer>
          </HeaderContainer>
        }
      />
      {/* {realmVaults.map((vault) => (
        <VaultCard
          vaultId={vault.vaultId}
          tokens={vault.tokens}
          key={vault.vaultId}
        />
      ))} */}
    </Container>
  );
}

const TreasuryText = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 40px;
  font-weight: bold;
  text-align: right;
`;

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[900]};
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[4]};
`;

const TreasuryValueContainer = styled.View``;

const SubtitleText = styled.Text`
  text-align: right;

  color: ${(props: any) => props.theme.gray[400]};
  font-size: 16px;
`;

const HeaderContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
`;
