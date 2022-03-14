import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { SvgXml, SvgUri } from "react-native-svg";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";

interface RealmIconProps {
  realmId: string;
  size?: number;
}

export const RealmIcon = ({ realmId, size = 48 }: RealmIconProps) => {
  const { realmsData } = useAppSelector((state) => state.realms);

  // tries to handle all the edge cases in governance-ui realms image list
  const renderRealmIconImage = () => {
    let iconImage;
    let isSvgImage = true;
    let jdenticonSvg = createAvatar(style, {
      seed: realmId,
    });

    let realmIconUrl = realmsData[realmId]?.ogImage;
    let fullFilePath = realmIconUrl?.slice(0, 5) === "https";
    // image is a png, render regular image component
    if (realmIconUrl?.slice(-3) === "png") {
      isSvgImage = false;
    }

    // image url has a relative path
    if (!fullFilePath) {
      realmIconUrl = `https://realms.today${realmIconUrl}`;
    }

    if (isSvgImage && fullFilePath) {
      // if is svg + has a full url to svg
      return <SvgUri width={size - 12} height={size - 12} uri={realmIconUrl} />;
    }

    iconImage = isSvgImage ? (
      <SvgXml
        key={realmId}
        width={size - 12}
        height={size - 12}
        // style={{ marginBottom: 12 }}
        xml={jdenticonSvg}
      />
    ) : (
      <RealmIconImage
        key={realmId}
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

const RealmIconImage = styled.Image`
  width: 38px;
  min-width: 38px;
  height: 38px;
  min-height: 38px;
  justify-content: center;
  align-self: center;
  overflow: hidden;
`;
