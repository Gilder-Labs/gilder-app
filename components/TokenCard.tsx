import React from "react";
import styled from "styled-components/native";
import numeral from "numeral";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

interface TokenCardProps {
  token: any;
}

export const TokenCard = ({ token }: TokenCardProps) => {
  const { tokenPriceData } = useAppSelector((state) => state.realms);

  const coinGeckoId = token?.extensions?.coingeckoId;

  return (
    <CoinCard key={token.mint + token.owner}>
      <CoinIcon
        source={{
          uri: token.logoURI,
        }}
      />
      <CoinTextContainer>
        <CoinTitleContainer>
          <CoinTitle>{token.name || "Unknown Token"}</CoinTitle>
          <CoinSubtitle>
            {numeral(token.tokenAmount.uiAmount).format("0.00a")} {token.symbol}
          </CoinSubtitle>
        </CoinTitleContainer>
        <CoinPriceContainer>
          {coinGeckoId && (
            <CoinPriceText>
              $
              {numeral(
                tokenPriceData[coinGeckoId].current_price *
                  token.tokenAmount.uiAmount
              ).format("0.00a")}
            </CoinPriceText>
          )}
          {coinGeckoId && (
            <CoinPercentText
              isNegative={
                tokenPriceData[coinGeckoId].price_change_percentage_24h < 0
              }
            >
              {numeral(
                tokenPriceData[coinGeckoId].price_change_percentage_24h
              ).format("0.00")}
              %
            </CoinPercentText>
          )}
        </CoinPriceContainer>
      </CoinTextContainer>
    </CoinCard>
  );
};

const CoinTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[200]};
  font-weight: bold;
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

const CoinTextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`;

const CoinTitleContainer = styled.View``;
const CoinPriceContainer = styled.View``;

const CoinPriceText = styled.Text`
  text-align: right;
  color: ${(props: any) => props.theme.gray[200]};
  font-weight: bold;
`;

const CoinPercentText = styled.Text<{ isNegative: boolean }>`
  text-align: right;
  color: ${(props: any) =>
    props.isNegative ? props.theme.error[500] : props.theme.success[500]};
`;
