import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { FlatList } from "react-native";
import { AnimatedImage } from "react-native-ui-lib";

interface NftListProps {
  nfts: Array<any>;
  vaultId?: string;
  isScrollable?: boolean;
}

export const NftList = ({
  nfts,
  vaultId = "",
  isScrollable = false,
}: NftListProps) => {
  const renderNft = ({ item }) => {
    return (
      <AnimatedImage
        key={item.id}
        style={{
          minHeight: 140,
          minWidth: "50%",
          marginRight: 8,
          // maxWidth: "50%",
          borderRadius: 8,
        }}
        source={{
          uri: item.img,
        }}
      />
    );
  };

  return (
    <FlatList
      listKey={"nft" + vaultId}
      data={nfts}
      renderItem={renderNft}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={isScrollable}
      style={{ paddingTop: 8 }}
      columnWrapperStyle={{ marginBottom: 8 }}
      scrollIndicatorInsets={{ right: 1 }}
      removeClippedSubviews={true}
      initialNumToRender={10}
    />
  );
};

const Container = styled.View`
  flex: 1;
`;
