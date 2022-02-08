import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import numeral from "numeral";
import axios from "axios";

interface TokenCardProps {
  token: any;
}

export const TokenCard = ({ token }: TokenCardProps) => {
  return (
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
  );
};

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
  min-height: 64px;
  background: ${(props: any) => props.theme.gray[900]};
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
`;

const CoinTitleContainer = styled.View``;
