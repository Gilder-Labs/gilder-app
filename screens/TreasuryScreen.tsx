import { useEffect, useState } from "react";
import { StyleSheet, SectionList, FlatList } from "react-native";
import { RootTabScreenProps } from "../types";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import styled from "styled-components/native";
import { VaultCard, Loading } from "../components";
import numeral from "numeral";

export default function TreasuryScreen({
  navigation,
}: RootTabScreenProps<"Treasury">) {
  const { tokenPriceData, vaults, isLoadingVaults } = useAppSelector(
    (state) => state.treasury
  );
  const { isLoadingSelectedRealm } = useAppSelector((state) => state.realms);
  const [treasuryValue, setTreasuryValue] = useState("0");

  const getTreasuryTotalValue = () => {
    let totalValue = 0;

    vaults.forEach((vault) => {
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
  }, [vaults]);

  // * list vaults - use public key for name?
  // * onclick vault list tokens in stack?
  // * get token prices
  // * get total treasury prices

  const renderVault = ({ item }: any) => {
    return (
      <VaultCard
        vaultId={item.pubKey}
        tokens={item.tokens}
        key={item.vaultId}
      />
    );
  };

  return (
    <Container>
      {isLoadingVaults || isLoadingSelectedRealm ? (
        <Loading />
      ) : (
        <FlatList
          data={vaults}
          renderItem={renderVault}
          keyExtractor={(item) => item.vaultId}
          style={{ padding: 16 }}
          ListFooterComponent={<EmptyView />}
          scrollIndicatorInsets={{ right: 1 }}
          ListHeaderComponent={
            <HeaderContainer>
              <TreasuryValueContainer>
                <SubtitleText> Total Balance </SubtitleText>
                <TreasuryText>{treasuryValue}</TreasuryText>
              </TreasuryValueContainer>
            </HeaderContainer>
          }
        />
      )}
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

const EmptyView = styled.View`
  height: 100px;
`;
