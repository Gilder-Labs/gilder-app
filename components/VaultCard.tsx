import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { TokenList } from "./TokenList";
import { NftList } from "./NftList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createProposalAttempt } from "../store/proposalActionsSlice";

import { Typography } from "./Typography";
import numeral from "numeral";
import { PublicKeyTextCopy } from "./PublicKeyTextCopy";
import { ExpandableSection } from "react-native-ui-lib";
import { useTheme } from "styled-components";
import { getFilteredTokens } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons/faChevronRight";
import { faChevronDown } from "@fortawesome/pro-regular-svg-icons/faChevronDown";
import { useQuery, gql } from "@apollo/client";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

const GET_WALLET_NFTS = gql`
  query nfts($owners: [PublicKey!]) {
    nfts(owners: $owners, limit: 10000, offset: 0) {
      name
      mintAddress
      address
      image
      updateAuthorityAddress
      collection {
        creators {
          verified
          address
        }
        mintAddress
      }
    }
  }
`;

// const GET_REALMS = gql`
//   query realms($addresses: [PublicKey!], $communityMints: [PublicKey!]) {
//     realms(addresses: $addresses, communityMints: $communityMints) {
//       address
//       communityMint
//       votingProposalCount
//       authority
//       name
//       realmConfig {
//         realmAddress
//         councilMint
//       }
//     }
//   }
// `;

interface VaultCardProps {
  vaultId: string;
  tokens: Array<any>;
  isGovernanceVault: boolean;
}

export const VaultCard = ({
  vaultId,
  tokens,
  isGovernanceVault,
}: VaultCardProps) => {
  const { tokenPriceData, vaults } = useAppSelector((state) => state.treasury);
  const { loading, error, data } = useQuery(GET_WALLET_NFTS, {
    variables: { owners: [vaultId] },
  });

  // const { data: realmsData } = useQuery(GET_REALMS, {
  //   variables: {
  //     addresses: ["6jydyMWSqV2bFHjCHydEQxa9XfXQWDwjVqAdjBEA1BXx"],
  //     communityMints: ["EjAZ95WZM9Z4o1asCD3d7Pxo3YUcTkyVbR8xC3pKAHX1"],
  //   },
  // });

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [nftSectionOpen, setNftSectionOpen] = useState(true);
  const [tokenSectionOpen, setTokenSectionOpen] = useState(true);
  const theme = useTheme();

  const getVaultTotalValue = () => {
    let totalValue = 0;
    tokens?.forEach((token) => {
      const coinGeckoId = token?.extensions?.coingeckoId;
      totalValue +=
        tokenPriceData[coinGeckoId]?.current_price *
          token.tokenAmount.uiAmount || 0;
    });
    return totalValue;
  };

  const nfts = data?.nfts ? data?.nfts : [];
  const filteredTokens = getFilteredTokens(nfts, tokens);
  const totalValue = getVaultTotalValue();

  // If the vault has no tokens of value ||
  // TODO: handle this by setting
  if ((!tokens?.length || totalValue < 0.1) && !nfts?.length) {
    return <></>;
  }

  const handleVaultOpenBrowser = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    //@ts-ignore
    navigation.push("WebViewScreen", {
      walletId: vaultId,
    });
  };

  const tryCreateProposal = () => {
    const vault = vaults.find((vault) => vault.pubKey === vaultId);

    dispatch(createProposalAttempt({ vault }));
  };

  return (
    <Container>
      <TitleContainer>
        <PublicKeyTextCopy
          publicKey={vaultId}
          size="body"
          shade="400"
          hideIcon={true}
        />
        {/* <TempButton onPress={handleVaultOpenBrowser}>
          <Typography text="Open Browser" />
        </TempButton> */}
        {/* <CreateProposalButton onPress={tryCreateProposal}>
          <Typography text="Create Proposal" marginBottom="0" size="subtitle" />
        </CreateProposalButton> */}
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
                  text={`Tokens (${filteredTokens?.length})`}
                  size="body"
                  shade="300"
                />
                {tokenSectionOpen ? (
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    size={16}
                    color={theme.gray[400]}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={16}
                    color={theme.gray[500]}
                  />
                )}
              </SectionHeaderContainer>
            }
            onPress={() => setTokenSectionOpen(!tokenSectionOpen)}
          >
            <TokenList
              tokens={filteredTokens}
              tokenPriceData={tokenPriceData}
              walletId={vaultId}
              // hideUnknownTokens={true}
            />
          </ExpandableSection>
        </SectionContainer>
      )}

      {nfts?.length > 0 && (
        <SectionContainer>
          <ExpandableSection
            top={false}
            expanded={nftSectionOpen}
            sectionHeader={
              <SectionHeaderContainer>
                <Typography
                  text={`Nfts (${nfts?.length})`}
                  size="body"
                  shade="300"
                />
                {nftSectionOpen ? (
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    size={16}
                    color={theme.gray[400]}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={16}
                    color={theme.gray[600]}
                  />
                )}
              </SectionHeaderContainer>
            }
            onPress={() => setNftSectionOpen(!nftSectionOpen)}
          >
            <NftList nfts={data?.nfts ? data?.nfts : []} walletId={vaultId} />
          </ExpandableSection>
        </SectionContainer>
      )}
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
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

const CreateProposalButton = styled.TouchableOpacity`
  padding: ${(props: any) => props.theme.spacing[2]};
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};

  background: ${(props: any) => props.theme.gray[900]};
  border-radius: 8px;
`;
