import { useEffect, useState } from "react";
import { StyleSheet, SectionList, FlatList } from "react-native";
import { RootTabScreenProps } from "../types";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import styled from "styled-components/native";
import { VaultCard, Loading } from "../components";
import numeral from "numeral";
import { fetchVaultPrices } from "../store/treasurySlice";

export default function TreasuryScreen({
  navigation,
}: RootTabScreenProps<"Treasury">) {
  const {
    tokenPriceData,
    vaults,
    isLoadingVaults,
    isLoadingVaultPrices,
    governances,
  } = useAppSelector((state) => state.treasury);
  const { isLoadingSelectedRealm, selectedRealm } = useAppSelector(
    (state) => state.realms
  );
  const [treasuryValue, setTreasuryValue] = useState("0");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (vaults.length) {
      dispatch(fetchVaultPrices(""));
    }
  }, [governances]);

  const getTreasuryTotalValue = () => {
    let totalValue = 0;

    vaults?.forEach((vault) => {
      vault?.tokens?.forEach((token: any) => {
        const coinGeckoId = token?.extensions?.coingeckoId;
        totalValue +=
          tokenPriceData[coinGeckoId]?.current_price *
            token.tokenAmount.uiAmount || 0;
      });
    });
    return numeral(totalValue).format("$0,0");
  };

  const sortedVaults = () => {
    let vaultsWithValue = [];

    vaults?.forEach((vault) => {
      let vaultValue = 0;
      vault?.tokens?.forEach((token: any) => {
        const coinGeckoId = token?.extensions?.coingeckoId;
        vaultValue +=
          tokenPriceData[coinGeckoId]?.current_price *
            token.tokenAmount.uiAmount || 0;
      });
      vaultsWithValue.push({ ...vault, vaultValue });
    });

    //@ts-ignore
    vaultsWithValue = vaultsWithValue?.sort(
      // @ts-ignore
      (a, b) => b?.vaultValue - a?.vaultValue
    );

    return vaultsWithValue || [];
  };

  useEffect(() => {
    setTreasuryValue(getTreasuryTotalValue());
  }, [vaults]);

  // * list vaults - use public key for name?
  // * onclick vault list tokens in stack?
  // * get token prices
  // * get total treasury prices

  const renderVault = ({ item, index }: any) => {
    return (
      <VaultCard
        vaultId={item.pubKey}
        tokens={item.tokens}
        isGovernanceVault={item.isGovernanceVault}
        key={`${item.pubKey}-${index}`}
      />
    );
  };

  return (
    <Container>
      {isLoadingVaults || isLoadingSelectedRealm || isLoadingVaultPrices ? (
        <Loading />
      ) : (
        <FlatList
          data={sortedVaults()}
          renderItem={renderVault}
          keyExtractor={(item, index) => `${item.vaultId}-${index}`}
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
