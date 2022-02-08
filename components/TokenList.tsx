import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { clusterApiUrl } from "@solana/web3.js";
import numeral from "numeral";
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
  return (
    <Container>
      {tokens.map((token) => (
        <CoinCard key={token.mint + token.owner}>
          <CoinIcon
            source={{
              uri: token.logoURI,
            }}
          />
          <CoinTitleContainer>
            <CoinTitle>{token.name || "Unknown Token"}</CoinTitle>
            <CoinSubtitle>
              {numeral(token.tokenAmount.uiAmount).format("0.00a")}
            </CoinSubtitle>
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
  background: ${(props: any) => props.theme.gray[900]};
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
`;

const CoinTitleContainer = styled.View``;
