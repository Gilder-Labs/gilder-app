import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import numeral from "numeral";
import { TokenCard } from "./TokenCard";
import { FlatList } from "react-native";

interface TokenCardProps {
  tokens: Array<any>;
  tokenPriceData: any;
  hideUnknownTokens?: boolean;
  vaultId?: string;
  isScrollable?: boolean;
  hideLowNumberTokens?: boolean;
  addSpacing?: boolean;
}

export const TokenList = ({
  tokens,
  tokenPriceData,
  hideUnknownTokens = false,
  vaultId = "",
  isScrollable = false,
  hideLowNumberTokens = false,
  addSpacing = false,
}: TokenCardProps) => {
  const renderToken = ({ item }) => {
    return (
      <TokenCard
        token={item}
        key={item.mint + item.vaultId}
        tokenPriceData={tokenPriceData}
        hideUnknownTokens={hideUnknownTokens}
        hideLowNumberTokens={hideLowNumberTokens}
      />
    );
  };

  return (
    <FlatList
      listKey={"token" + vaultId}
      data={tokens}
      renderItem={renderToken}
      keyExtractor={(item) => item.mint}
      scrollEnabled={isScrollable}
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
