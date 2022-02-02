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

  console.log("Token Map", tokenMap);
  console.log(
    "Mango token?",
    tokenMap.get("MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac")
  );

  return (
    <Container>
      {tokens.map((token) => (
        <CoinCard>
          <CoinIcon
            source={{
              uri: tokenMap.get(token.mint)?.logoURI,
            }}
          />
          <CoinTitle>
            {tokenMap.get(token.mint)?.name || "Unknown Token"}
          </CoinTitle>
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

const CoinIcon = styled.Image`
  width: 32px;
  height: 32px;
`;

const CoinCard = styled.View`
  height: 80;
  background: ${(props: any) => props.theme.gray[700]};
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
`;
