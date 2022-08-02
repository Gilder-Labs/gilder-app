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
}

export const TokenList = ({
  tokens,
  tokenPriceData,
  hideUnknownTokens = false,
  walletId = "",
  isScrollable = false,
  hideLowNumberTokens = false,
  addSpacing = false,
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

  console.log("TOKENS IN TOKEN LIST", tokens);
  return (
    <FlatList
      listKey={"token" + walletId}
      data={tokens}
      renderItem={renderToken}
      scrollEnabled={isScrollable}
      keyExtractor={(item) => `${item.address}-${item.owner} `}
      // columnWrapperStyle={{ marginBottom: 8 }}
      scrollIndicatorInsets={{}}
      initialNumToRender={50}
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
