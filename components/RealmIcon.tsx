import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { SvgXml, SvgUri } from "react-native-svg";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";

interface RealmIconProps {
  realmId: string;
}

export const RealmIcon = ({ realmId }: RealmIconProps) => {
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
      return <SvgUri width="36" height="36" uri={realmIconUrl} />;
    }

    iconImage = isSvgImage ? (
      <SvgXml
        key={realmId}
        width="36"
        height="36"
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
  return <Container>{renderRealmIconImage()}</Container>;
};

const Container = styled.View`
  height: 36px;
  min-width: 36px;
  border-radius: 4px;
  overflow: hidden;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
`;

const RealmIconImage = styled.Image`
  width: 36px;
  min-width: 36px;
  height: 36px;
  min-height: 36px;
  justify-content: center;
  align-self: center;
  overflow: hidden;
`;
