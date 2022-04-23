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
}

export const TokenList = ({
  tokens,
  tokenPriceData,
  hideUnknownTokens = false,
  vaultId = "",
  isScrollable = false,
}: TokenCardProps) => {
  const renderToken = ({ item }) => {
    return (
      <TokenCard
        token={item}
        key={item.mint + item.vaultId}
        tokenPriceData={tokenPriceData}
        hideUnknownTokens={hideUnknownTokens}
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
      scrollIndicatorInsets={{ right: 1 }}
      removeClippedSubviews={true}
      initialNumToRender={10}
    />
  );
};

const Container = styled.View`
  flex: 1;
`;
