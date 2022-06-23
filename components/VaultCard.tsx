import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { TokenList } from "./TokenList";
import { NftList } from "./NftList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Typography } from "./Typography";
import numeral from "numeral";
import { PublicKeyTextCopy } from "./PublicKeyTextCopy";
import { ExpandableSection } from "react-native-ui-lib";
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import { getFilteredTokens } from "../utils";

interface VaultCardProps {
  vaultId: string;
  tokens: Array<any>;
}

export const VaultCard = ({ vaultId, tokens }: VaultCardProps) => {
  const { tokenPriceData, vaultsNfts } = useAppSelector(
    (state) => state.treasury
  );
  const [nftSectionOpen, setNftSectionOpen] = useState(true);
  const [tokenSectionOpen, setTokenSectionOpen] = useState(true);
  const theme = useTheme();

  const getVaultTotalValue = () => {
    let totalValue = 0;
    tokens.forEach((token) => {
      const coinGeckoId = token?.extensions?.coingeckoId;
      totalValue +=
        tokenPriceData[coinGeckoId]?.current_price *
          token.tokenAmount.uiAmount || 0;
    });
    return totalValue;
  };

  const nfts = vaultsNfts[vaultId];
  const filteredTokens = getFilteredTokens(nfts, tokens);
  const totalValue = getVaultTotalValue();

  // If the vault has no tokens of value ||
  // TODO: handle this by setting
  if ((!tokens.length || totalValue < 0.5) && !nfts.length) {
    console.log("total value", totalValue);
    return <></>;
  }

  return (
    <Container>
      <TitleContainer>
        <PublicKeyTextCopy publicKey={vaultId} fontSize={14} />
        <VaultValue>{numeral(totalValue).format("$0,0")}</VaultValue>
      </TitleContainer>

      {tokens.length > 0 && (
        <SectionContainer>
          <ExpandableSection
            top={false}
            expanded={tokenSectionOpen}
            sectionHeader={
              <SectionHeaderContainer>
                <Typography
                  text={`Tokens (${filteredTokens.length})`}
                  size="body"
                  shade="400"
                />
                {tokenSectionOpen ? (
                  <Unicons.UilAngleDown size="28" color={theme.gray[300]} />
                ) : (
                  <Unicons.UilAngleRight size="28" color={theme.gray[600]} />
                )}
              </SectionHeaderContainer>
            }
            onPress={() => setTokenSectionOpen(!tokenSectionOpen)}
          >
            <TokenList
              tokens={filteredTokens}
              tokenPriceData={tokenPriceData}
              vaultId={vaultId}
              // hideUnknownTokens={true}
            />
          </ExpandableSection>
        </SectionContainer>
      )}

      {nfts.length > 0 && (
        <SectionContainer>
          <ExpandableSection
            top={false}
            expanded={nftSectionOpen}
            sectionHeader={
              <SectionHeaderContainer>
                <Typography
                  text={`Nfts (${nfts.length})`}
                  size="body"
                  shade="400"
                />
                {nftSectionOpen ? (
                  <Unicons.UilAngleDown size="28" color={theme.gray[300]} />
                ) : (
                  <Unicons.UilAngleRight size="28" color={theme.gray[600]} />
                )}
              </SectionHeaderContainer>
            }
            onPress={() => setNftSectionOpen(!nftSectionOpen)}
          >
            <NftList nfts={nfts} vaultId={vaultId} />
          </ExpandableSection>
        </SectionContainer>
      )}
    </Container>
  );
};

const Container = styled.View`
  width: 100%%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  padding: ${(props: any) => props.theme.spacing[4]};
  flex-direction: column;
`;

const SectionContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
`;

const VaultValue = styled.Text`
color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 24px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  margin-left: -${(props: any) => props.theme.spacing[2]}; // hidden padding of copy
`;

const SectionHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-color: ${(props) => props.theme.gray[700]};
  border-bottom-width: 1px;
`;
