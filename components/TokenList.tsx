import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import numeral from "numeral";
import { TokenCard } from "./TokenCard";
import { FlatList } from "react-native";

interface TokenCardProps {
  tokens: Array<any>;
  tokenPriceData: any;
  hideUnknownTokens?: boolean;
  walletId?: string;
  isScrollable?: boolean;
  hideLowNumberTokens?: boolean;
  addSpacing?: boolean;
  selectedToken?: any;
  onTokenSelect?: any;
  canSelect?: boolean;
}

export const TokenList = ({
  tokens,
  tokenPriceData,
  hideUnknownTokens = false,
  walletId = "",
  isScrollable = false,
  hideLowNumberTokens = false,
  addSpacing = false,
  selectedToken = null,
  onTokenSelect = () => {},
  canSelect = false,
}: TokenCardProps) => {
  const renderToken = ({ item }) => {
    return (
      <TokenCard
        token={item}
        key={`${item.address}-${item.owner}`}
        tokenPriceData={tokenPriceData}
        hideUnknownTokens={hideUnknownTokens}
        hideLowNumberTokens={hideLowNumberTokens}
      />
    );
  };

  if (canSelect) {
    return (
      <TokenSelectScrollView>
        {tokens.map((token) => {
          return (
            <TokenCard
              token={token}
              key={`${token.address}-${token.owner}`}
              tokenPriceData={tokenPriceData}
              hideUnknownTokens={hideUnknownTokens}
              hideLowNumberTokens={hideLowNumberTokens}
              onTokenPress={onTokenSelect}
              canSelect={canSelect}
              selectedToken={selectedToken}
            />
          );
        })}
      </TokenSelectScrollView>
    );
  }

  return (
    <FlatList
      listKey={"token" + walletId}
      data={tokens}
      renderItem={renderToken}
      scrollEnabled={isScrollable}
      keyExtractor={(item, index) => `${index}-${item.owner} `}
      // columnWrapperStyle={{ marginBottom: 8 }}
      scrollIndicatorInsets={{}}
      initialNumToRender={10}
      style={{
        paddingLeft: addSpacing ? 16 : 0,
        paddingRight: addSpacing ? 16 : 0,
        minWidth: "100%",
      }}
    />
  );
};

const Container = styled.View`
  flex: 1;
`;

const TokenSelectScrollView = styled.ScrollView`
  width: 100%;
  padding-bottom: ${(props: any) => props.theme.spacing[3]};
  padding-top: ${(props: any) => props.theme.spacing[2]};
  padding-left: ${(props: any) => props.theme.spacing[2]};
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};

  border-radius: 8px;
  background: ${(props) => props.theme.gray[800]};
  max-height: 400px;
`;
