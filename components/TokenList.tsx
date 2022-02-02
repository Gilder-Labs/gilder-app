import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
import { clusterApiUrl } from "@solana/web3.js";

// some code from https://github.com/solana-labs/token-list

interface TokenCardProps {
  tokens: Array<any>;
}

const ENV = {
  MainnetBeta: 101,
  Testnet: 102,
  Devnet: 103,
};

export const TokenList = ({ tokens }: TokenCardProps) => {
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());

  // Move this to solanaSlice and save in store
  useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens.filterByChainId(ENV.MainnetBeta).getList();

      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
    });
  }, [setTokenMap]);

  return (
    <Container>
      {tokens.map((token) => (
        <CoinCard key={token.mint}>
          <CoinIcon
            source={{
              uri: tokenMap.get(token.mint)?.logoURI,
            }}
          />
          <CoinTitleContainer>
            <CoinTitle>
              {tokenMap.get(token.mint)?.name || "Unknown Token"}
            </CoinTitle>
            <CoinSubtitle>{token.tokenAmount.uiAmountString}</CoinSubtitle>
          </CoinTitleContainer>
        </CoinCard>
      ))}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const CoinTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[200]};
`;

const CoinSubtitle = styled.Text`
  color: ${(props: any) => props.theme.gray[400]};
`;

const CoinIcon = styled.Image`
  width: 40px;
  height: 40px;
  margin-right: ${(props: any) => props.theme.spacing[3]};
`;
const CoinCard = styled.View`
  height: 64px;
  background: ${(props: any) => props.theme.gray[700]};
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
`;

const CoinTitleContainer = styled.View``;
