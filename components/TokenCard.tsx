import React from "react";
import styled from "styled-components/native";
import numeral from "numeral";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";
import { AnimatedImage } from "react-native-ui-lib";

interface TokenCardProps {
  token: any;
  tokenPriceData: any;
  hideUnknownTokens: boolean;
}

export const TokenCard = ({
  token,
  tokenPriceData,
  hideUnknownTokens,
}: TokenCardProps) => {
  let jdenticonSvg = createAvatar(style, {
    seed: token.mint,
  });
  const coinGeckoId = token?.extensions?.coingeckoId;

  if (!token.name && hideUnknownTokens) {
    return null;
  }

  return (
    <CoinCard key={token.mint + token.owner}>
      <CoinImageContainer>
        <AnimatedImage
          style={{
            width: 40,
            height: 40,
            overflow: "hidden",
          }}
          source={{
            uri: token.logoURI,
          }}
        />
      </CoinImageContainer>
      <CoinTextContainer>
        <CoinTitleContainer>
          <CoinTitle>
            {token.name ||
              `Unknown Token (${token.mint.slice(0, 3)}...${token.mint.slice(
                -3
              )})`}
          </CoinTitle>
          <CoinSubtitle>
            {numeral(token.tokenAmount.uiAmount).format("0.00a")} {token.symbol}
          </CoinSubtitle>
        </CoinTitleContainer>
        <CoinPriceContainer>
          {coinGeckoId && tokenPriceData && (
            <CoinPriceText>
              {numeral(
                tokenPriceData[coinGeckoId]?.current_price *
                  token.tokenAmount.uiAmount
              ).format("$0.00a")}
            </CoinPriceText>
          )}
          {coinGeckoId && tokenPriceData && (
            <CoinPercentText
              isNegative={
                tokenPriceData[coinGeckoId]?.price_change_percentage_24h < 0
              }
            >
              {numeral(
                tokenPriceData[coinGeckoId]?.price_change_percentage_24h
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
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
`;

const CoinSubtitle = styled.Text`
  color: ${(props: any) => props.theme.gray[400]};
`;

const CoinIcon = styled.Image`
  width: 40px;
  height: 40px;
  overflow: hidden;
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

const CoinImageContainer = styled.View`
  /* border: 1px solid red; */
  border-radius: 100px;
  overflow: hidden;
  margin-right: ${(props: any) => props.theme.spacing[3]};
`;

const CoinTitleContainer = styled.View``;
const CoinPriceContainer = styled.View``;

const CoinPriceText = styled.Text`
  text-align: right;
  color: ${(props: any) => props.theme.gray[200]};
  font-weight: bold;
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
`;

const CoinPercentText = styled.Text<{ isNegative: boolean }>`
  text-align: right;
  color: ${(props: any) =>
    props.isNegative ? props.theme.error[500] : props.theme.success[500]};
`;

const EmptyView = styled.View``;
