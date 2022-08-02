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
      <ImageContainer>
        <AnimatedImage
          key={item.id}
          style={{
            minHeight: 160,
            height: "auto",
            minWidth: "48%",
            // maxWidth: "50%",
            borderRadius: 8,
            resizeMode: "contain",
          }}
          source={{
            // uri: "",
            uri: item.img,
          }}
        />
      </ImageContainer>
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
      columnWrapperStyle={{ marginBottom: 8, justifyContent: "space-around" }}
      scrollIndicatorInsets={{ right: 1 }}
      initialNumToRender={10}
    />
  );
};

const Container = styled.View`
  flex: 1;
`;

const ImageContainer = styled.View`
  background: ${(props) => props.theme.gray[900]};
  border-radius: 8px;
`;
