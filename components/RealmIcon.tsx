import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { SvgXml } from "react-native-svg";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";

interface RealmIconProps {
  realmId: string;
}

export const RealmIcon = ({ realmId }: RealmIconProps) => {
  const { realmsData } = useAppSelector((state) => state.realms);
  let isSvgImage = true;

  let jdenticonSvg = createAvatar(style, {
    seed: realmId,
    // ... and other options
  });

  // tries to handle all the edge cases in governance-ui realms image list
  let realmIconUrl =
    realmsData && realmsData[`${realmId}`].ogImage
      ? realmsData[realmId].ogImage
      : "";

  if (realmIconUrl.slice(-3) === "png") {
    isSvgImage = false;
  }

  if (realmIconUrl.slice(0, 5) !== "https") {
    realmIconUrl = `https://realms.today${realmIconUrl}`;
  }

  return (
    <Container>
      {isSvgImage ? (
        <SvgXml
          key={realmId}
          width="44"
          height="44"
          style={{ marginBottom: 12 }}
          xml={jdenticonSvg}
        />
      ) : (
        <RealmIconImage
          key={realmId}
          source={{
            uri: realmIconUrl,
          }}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  height: 44px;
  border-radius: 4px;
`;

const RealmIconImage = styled.Image`
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  justify-content: center;
  align-self: center;
`;
