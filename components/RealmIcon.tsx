import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { AnimatedImage } from "react-native-ui-lib";
import { LinearGradient } from "expo-linear-gradient";
import { getColorType } from "../utils";
import { useTheme } from "styled-components";

interface RealmIconProps {
  realmId: string;
  size?: number;
}

export const RealmIcon = ({ realmId, size = 48 }: RealmIconProps) => {
  const { realmsData } = useAppSelector((state) => state.realms);
  const color = getColorType(realmId);
  const color2 = getColorType(realmId.charAt(realmId.length - 1));
  const theme = useTheme();

  // tries to handle all the edge cases in governance-ui realms image list
  const renderRealmIconImage = () => {
    let iconImage;
    let isSvgImage = true;

    let realmIconUrl = realmsData[realmId]?.ogImage;
    let isFullFilePath = realmIconUrl?.slice(0, 5) === "https";
    // image is a png, render regular image component
    if (
      realmIconUrl?.slice(-3) === "png" ||
      realmIconUrl?.slice(-3) === "jpg"
    ) {
      isSvgImage = false;
    }

    // image url has a relative path
    if (!isFullFilePath) {
      realmIconUrl = `https://realms.today${realmIconUrl}`;
    }

    if (isSvgImage && isFullFilePath) {
      // if is svg + has a full url to svg
      return (
        <AnimatedImage
          style={{
            width: 38,
            height: 38,
            overflow: "hidden",
          }}
          source={{
            uri: realmIconUrl,
          }}
        />
      );
    }

    iconImage = isSvgImage ? (
      <LinearGradient
        // Background Linear Gradient
        // @ts-ignore
        colors={[`${theme[color][600]}`, `${theme[color2][900]}`]}
        style={{ height: size - 10, width: size - 10 }}
        start={{ x: 0.1, y: 0.2 }}
      />
    ) : (
      <AnimatedImage
        style={{
          width: 38,
          height: 38,
          overflow: "hidden",
        }}
        source={{
          uri: realmIconUrl,
        }}
      />
    );
    return iconImage;
  };
  return <Container size={size - 10}>{renderRealmIconImage()}</Container>;
};

const Container = styled.View<{ size: number }>`
  height: ${(props) => props.size}px;
  min-width: ${(props) => props.size}px;
  overflow: hidden;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
`;
